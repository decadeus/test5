import Stripe from 'stripe';
import { buffer } from 'micro';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

  // 🎯 Paiement confirmé
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log('✅ Paiement confirmé pour', session.customer_email);

    const userId = session.metadata?.supabaseUserId;
    const priceId = session.metadata?.priceId;

    let maxProjects;
    if (priceId === 'price_id_147') maxProjects = 1;
    else if (priceId === 'price_id_500') maxProjects = 5;
    else maxProjects = null;

    if (!userId || !maxProjects) {
      console.error('❌ Données manquantes dans metadata');
      return res.status(400).json({ error: 'Invalid metadata' });
    }

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

  // 🎯 Client Stripe créé → créer ou lier un user Supabase
  if (event.type === 'customer.created') {
    const customer = event.data.object;
    const email = customer.email;

    if (!email) {
      console.warn('❗ Client Stripe sans email, on ignore.');
      return res.status(400).json({ error: 'Customer missing email' });
    }

    // Vérifie si l'utilisateur existe déjà dans auth.users
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (checkError) {
      console.error('❌ Erreur lecture Supabase users :', checkError.message);
      return res.status(500).json({ error: 'Supabase read error' });
    }

    let userId;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
      console.log(`ℹ️ Utilisateur existant trouvé pour ${email}`);
    } else {
      const password = crypto.randomUUID();

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) {
        console.error(`❌ Erreur création utilisateur Supabase :`, createError.message);
        return res.status(500).json({ error: 'Création utilisateur échouée' });
      }

      userId = newUser.user.id;

      // Insère un profil lié
      const { error: insertProfileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        stripe_customer_id: customer.id,
      });

      if (insertProfileError) {
        console.error('❌ Erreur insertion profile :', insertProfileError.message);
        return res.status(500).json({ error: 'Erreur insertion profile' });
      }

      console.log(`✅ Utilisateur et profil créés pour ${email}`);
      return res.status(200).json({ status: 'created' });
    }

    // Si utilisateur existait déjà, mise à jour du profil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Erreur mise à jour profil :', updateError.message);
      return res.status(500).json({ error: 'Erreur mise à jour profil' });
    }

    console.log(`✅ Profil mis à jour avec Stripe ID pour ${email}`);
  }

  res.status(200).json({ received: true });
}
