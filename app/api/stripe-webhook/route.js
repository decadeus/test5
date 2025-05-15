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

      const { data: userData, error: userError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (userError) {
        console.error('❌ Erreur création utilisateur Supabase :', userError.message);
        // ⚠️ Tu peux continuer même si l’utilisateur existe déjà
      } else {
        console.log(`✅ Utilisateur créé dans Supabase : ${email}`);
      }
    }

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
