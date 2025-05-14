import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing session_id' }), { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return new Response(JSON.stringify({ status: session.status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erreur vérification session Stripe:', err);
    return new Response(JSON.stringify({ error: 'Stripe error' }), { status: 500 });
  }
}
