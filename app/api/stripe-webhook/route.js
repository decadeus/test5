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
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'customer.subscription.created' || event.type === 'checkout.session.completed') {
    let email = null;
    let subscription = null;
    let stripeCustomerId = null;
    let stripeSubscriptionId = null;

    if (event.type === 'customer.subscription.created') {
      subscription = event.data.object;
      try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        email = customer.email;
        stripeCustomerId = subscription.customer;
        stripeSubscriptionId = subscription.id;
      } catch (err) {
        // console.warn('⚠️ Impossible de récupérer l'email client :', err.message);
      }
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      email = session.customer_email || session.customer_details?.email;
      stripeCustomerId = session.customer;
      // Pour récupérer l'id de souscription Stripe, il faut parfois faire un appel supplémentaire :
      if (session.subscription) {
        stripeSubscriptionId = session.subscription;
        try {
          subscription = await stripe.subscriptions.retrieve(session.subscription);
        } catch (err) {
          // console.warn('⚠️ Impossible de récupérer la souscription Stripe :', err.message);
        }
      }
    }

    if (email) {
      let userId = null;
      const password = "101080";
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (userData?.user?.id) {
        userId = userData.user.id;
      } else if (userError) {
        const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers({ email });
        if (existingUser?.users?.[0]?.id) {
          userId = existingUser.users[0].id;
        }
      }
      if (userId) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: userId,
              email,
              role: 'promoteur',
              subscribed_at: new Date().toISOString(),
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              is_active: true,
            },
          ])
          .eq('id', userId);
      }
    }

    // Insérer la souscription dans la table subscriptions si on a les infos nécessaires
    if (subscription) {
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
        return new Response('Erreur insertion subscription', { status: 500 });
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
