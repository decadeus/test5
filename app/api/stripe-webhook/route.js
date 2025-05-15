// app/api/stripe-webhook/route.js
import { createClient } from '@/utils/supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient();

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw body
  },
};

export async function POST(req) {
  console.log('Webhook handler called'); // Log to confirm the handler is called
  const rawBody = await req.text(); // Get the raw body as a string
  const sig = req.headers.get('stripe-signature');

  // Log the raw body and signature for debugging
  console.log('Raw Body:', rawBody);
  console.log('Stripe Signature:', sig);

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the subscription created event
  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object;

    // Insert the subscription into Supabase
    const { error } = await supabase
      .from('subscriptions') // Ensure you have a subscriptions table
      .insert([
        {
          id: subscription.id,
          customer_id: subscription.customer,
          status: subscription.status,
         
         
          created_at: new Date(subscription.created * 1000).toISOString(),
        },
      ]);

    if (error) {
      console.error('Error inserting subscription:', error);
      return new Response('Error inserting subscription', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}