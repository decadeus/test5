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

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object;

    let email = null;
    try {
      const customer = await stripe.customers.retrieve(subscription.customer);
      email = customer.email;
      console.log('📧 Email client Stripe :', email);
    } catch (err) {
      console.warn('⚠️ Impossible de récupérer l’email client :', err.message);
    }

    if (email) {
      console.log('📨 Traitement de l’email :', email);
      const password = crypto.randomUUID();
      console.log('🔐 Password généré :', password);

      let userId = null;

      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      console.log('📤 Résultat création user Supabase :', userData, userError);

      if (userData?.user?.id) {
        userId = userData.user.id;
      } else if (userError) {
        const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers({ email });
        if (existingUser?.users?.[0]?.id) {
          userId = existingUser.users[0].id;
          console.log('🔁 Utilisateur existant trouvé :', userId);
        } else {
          console.error('❌ Impossible de récupérer un utilisateur existant :', fetchError?.message);
        }
      }

      if (userId) {
        console.log('📤 Données envoyées au upsert :', {
          id: userId,
          email,
          role: 'promoteur',
          subscribed_at: new Date().toISOString(),
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          is_active: true,
        });
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: userId,
              email,
              role: 'promoteur',
              subscribed_at: new Date().toISOString(),
              stripe_customer_id: subscription.customer,
              stripe_subscription_id: subscription.id,
              is_active: true,
            },
          ])
          .eq('id', userId);

        if (upsertError) {
          console.error('❌ Erreur upsert profil :', upsertError.message);
        } else {
          console.log(`✅ Profil promoteur inséré ou mis à jour : ${email}`);
        }

        if (userData?.user?.id) {
          const { error: testLoginError } = await supabase.from('test_logins').insert([
            {
              email,
              password,
              created_at: new Date().toISOString(),
            },
          ]);
          if (testLoginError) {
            console.error('❌ Échec insertion dans test_logins :', testLoginError.message);
          } else {
            console.log('✅ Insertion test_logins réussie');
          }
        }
      }
    }

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
