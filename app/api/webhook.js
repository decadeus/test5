import Stripe from 'stripe';
import { buffer } from 'micro';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Supabase service role (⚠️ à ne jamais exposer côté client)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Stripe impose de désactiver le bodyParser pour vérifier la signature
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Méthode non autorisée');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Erreur de signature du webhook :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 On écoute : checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log('✅ Paiement confirmé pour', session.customer_email);

    const userId = session.metadata?.supabaseUserId;
    const priceId = session.metadata?.priceId;

    // ⚠️ Stripe ne renvoie pas le montant en clair ici → on s'appuie sur metadata
    let maxProjects;
    if (priceId === 'price_id_147') maxProjects = 1;
    else if (priceId === 'price_id_500') maxProjects = 5;
    else maxProjects = null;

    if (!userId || !maxProjects) {
      console.error('❌ Données manquantes dans metadata');
      return res.status(400).json({ error: 'Invalid metadata' });
    }

    // 🔄 Mettre à jour la table "profiles"
    const { error } = await supabase
      .from('profiles')
      .update({
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        max_projects,
        is_active: true,
      })
      .eq('id', userId);

    if (error) {
      console.error('❌ Erreur mise à jour Supabase :', error.message);
      return res.status(500).json({ error: 'Supabase update failed' });
    }

    console.log('✅ Abonnement enregistré dans Supabase pour user', userId);
  }

  // Tu pourras gérer d'autres événements ici plus tard

  res.status(200).json({ received: true });
}
