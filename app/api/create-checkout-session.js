import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { priceId, email, userId } = req.body;

  // ⚠️ Vérification basique des données entrantes
  if (!priceId || !email || !userId) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      metadata: {
        supabaseUserId: userId,
        priceId,
      },

      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    return res.status(200).json({ sessionId: session.id });

  } catch (err) {
    console.error('❌ Erreur Stripe:', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
