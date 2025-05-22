import Stripe from 'stripe';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔗 Test Supabase SELECT');
const { data: testData, error: testError } = await supabase.from('profiles').select('*').limit(1);
if (testError) console.error('❌ Supabase SELECT test échoué :', testError.message);
else console.log('✅ Supabase SELECT OK');

export async function POST(req) {
  console.log('✅ Webhook handler called');
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 🎯 Abonnement créé
  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object;

    // 🔍 Récupère l'email du client Stripe
    let email = null;
    try {
      const customer = await stripe.customers.retrieve(subscription.customer);
      email = customer.email;
      console.log('📧 Email client Stripe :', email);
    } catch (err) {
      console.warn('⚠️ Impossible de récupérer l’email client :', err.message);
    }

    // ✅ Crée un utilisateur Supabase s’il y a un email
    if (email) {
      const password = crypto.randomUUID();

      console.log('📨 Tentative de création Supabase user pour :', email);
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      console.log('📤 Résultat création user Supabase :', userData, userError);

      let userId = userData?.user?.id ?? null;

      if (userError) {
        console.warn('⚠️ Utilisateur déjà existant, tentative de récupération...');
        const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers({
          email,
        });

        if (!fetchError && existingUser?.users?.length) {
          userId = existingUser.users[0].id;
          console.log(`🔁 Utilisateur existant trouvé : ${userId}`);
        } else {
          console.error('❌ Impossible de récupérer l’utilisateur existant :', fetchError?.message);
        }
      }

      if (userId) {
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (profileCheckError || !existingProfile) {
          console.log('📌 Insertion profil avec ID :', userId);
          const { error: insertError } = await supabase.from('profiles').insert([
            {
              id: userId,
              email,
              role: 'promoteur',
              subscribed_at: new Date().toISOString(),
              stripe_customer_id: subscription.customer,
              stripe_subscription_id: subscription.id,
              is_active: true,
            },
          ]);

          if (insertError) {
            console.error('❌ Échec insertion profil :', insertError.message);
            console.error(insertError);
          } else {
            console.log(`✅ Profil promoteur créé : ${email}`);
            // 🧪 Enregistrement login de test
            const { error: testLoginError } = await supabase.from('test_logins').insert([
              {
                email,
                password,
                created_at: new Date().toISOString(),
              },
            ]);
            if (testLoginError) {
              console.error('❌ Échec insertion dans test_logins :', testLoginError.message);
            }
          }
        } else {
          console.log(`ℹ️ Profil déjà existant pour : ${email}`);
        }
      }
    } // <-- fin du if (email)

    // 💾 Insère la subscription dans Supabase
    const { error: insertError } = await supabase.from('subscriptions').insert([
      {
        id: subscription.id,
        customer_id: subscription.customer,
        email,
        status: subscription.status,
        created_at: new Date(subscription.created * 1000).toISOString(),
      },
    ]);

    if (insertError) {
      console.error('❌ Erreur insertion subscription :', insertError.message);
      return new Response('Erreur insertion subscription', { status: 500 });
    }

    console.log(`✅ Subscription insérée : ${subscription.id}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
