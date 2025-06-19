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
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId est requis' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🔧 Correction du statut pour userId:', userId);

    // Récupérer le profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile.stripe_subscription_id) {
      return new Response(JSON.stringify({ error: 'Aucun abonnement trouvé dans le profil' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📋 Profil trouvé:', profile);

    // Vérifier le statut dans Stripe
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      console.log('🔍 Statut Stripe:', stripeSubscription.status);

      // Déterminer si l'abonnement est actif
      const isActive = stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing';
      
      // Mettre à jour la base de données
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: stripeSubscription.status,
          is_active: isActive
        })
        .eq('id', profile.stripe_subscription_id);

      if (updateError) {
        console.error('❌ Erreur mise à jour:', updateError);
        return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('✅ Statut mis à jour:', { status: stripeSubscription.status, is_active: isActive });

      return new Response(JSON.stringify({ 
        success: true,
        stripeStatus: stripeSubscription.status,
        isActive: isActive,
        message: `Abonnement mis à jour: ${stripeSubscription.status} (actif: ${isActive})`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (stripeError) {
      console.error('❌ Erreur Stripe:', stripeError);
      return new Response(JSON.stringify({ error: 'Erreur lors de la vérification Stripe' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Erreur générale:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 