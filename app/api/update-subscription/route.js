import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { newPriceId, userId } = await req.json();

    if (!newPriceId || !userId) {
      return new Response(JSON.stringify({ error: 'newPriceId et userId sont requis' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer l'abonnement actuel de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile.stripe_subscription_id) {
      return new Response(JSON.stringify({ error: 'Aucun abonnement trouvé' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer l'abonnement Stripe
    const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
    
    // Créer une nouvelle session de paiement pour le changement d'abonnement
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: profile.stripe_customer_id,
      line_items: [{ price: newPriceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          change_subscription: 'true',
          old_subscription_id: profile.stripe_subscription_id,
          user_id: userId
        }
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/cancel`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 