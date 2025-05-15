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

    const { error } = await supabase
      .from('subscriptions')
      .insert([
        {
          id: subscription.id,
          customer_id: subscription.customer,
          status: subscription.status,
          created_at: new Date(subscription.created * 1000).toISOString(),
          email: subscription.email,
        },
      ]);

    if (error) {
      console.error('Error inserting subscription:', error);
      return new Response('Error inserting subscription', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
