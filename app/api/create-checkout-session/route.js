import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  const body = await req.json();
  const { priceId } = body;

  if (!priceId) {
    return new Response(JSON.stringify({ error: 'priceId manquant' }), { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/cancel`,
  });

  return new Response(JSON.stringify({ sessionId: session.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
