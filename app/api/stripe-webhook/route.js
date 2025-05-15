import { createClient } from '@/utils/supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient();

export async function POST(req) {
  console.log('Webhook handler called');
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  console.log('Raw Body:', rawBody);
  console.log('Stripe Signature:', sig);

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
if (event.type === 'customer.subscription.created') {
  const subscription = event.data.object;
  console.log('📦 Subscription object:', subscription);

  let email = null;
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    console.log('📨 Customer object:', customer);
    email = customer.email || null;
  } catch (err) {
    console.warn('⚠️ Impossible de récupérer l’email :', err.message);
  }

  console.log('📨 Email récupéré:', email);

  const insertPayload = {
    id: subscription.id,
    customer_id: subscription.customer,
    email,
    status: subscription.status,
    created_at: new Date(subscription.created * 1000).toISOString(),
  };

  console.log('📤 Données envoyées vers Supabase:', insertPayload);

  const { error } = await supabase.from('subscriptions').insert([insertPayload]);

  if (error) {
    console.error('❌ Erreur d’insertion Supabase :', error.message);
    return new Response('Erreur insertion subscription', { status: 500 });
  }

  console.log('✅ Insertion Supabase réussie pour', subscription.id);
}

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
