import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    console.log('🔍 Recherche abonnement pour userId:', userId);

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId est requis' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer le profil pour avoir le stripe_customer_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single();

    console.log('📋 Profil trouvé:', profile);
    console.log('❌ Erreur profil:', profileError);

    if (profileError || !profile.stripe_customer_id) {
      return new Response(JSON.stringify({ error: 'Aucun profil trouvé' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier que l'email correspond à l'utilisateur
    console.log('🔍 Vérification email:');
    console.log('   User ID demandé:', userId);
    console.log('   Email dans le profil:', profile.email);

    console.log('🔑 Stripe customer ID:', profile.stripe_customer_id);

    // Récupérer l'abonnement actif
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', profile.stripe_subscription_id)
      .eq('is_active', true)
      .single();

    console.log('📦 Abonnement trouvé:', subscription);
    console.log('❌ Erreur abonnement:', subscriptionError);

    // Vérifier directement l'abonnement sans filtre is_active
    const { data: directSubscription, error: directError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', profile.stripe_subscription_id)
      .single();

    console.log('🔍 Abonnement direct (sans filtre):', directSubscription);
    console.log('❌ Erreur directe:', directError);

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Erreur lors de la récupération de l\'abonnement' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Si aucun abonnement actif trouvé, essayer de récupérer tous les abonnements pour ce customer
    let allSubscriptions = [];
    if (!subscription) {
      console.log('🔍 Aucun abonnement actif trouvé, recherche de tous les abonnements...');
      const { data: allSubs, error: allSubError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_id', profile.stripe_customer_id)
        .order('created_at', { ascending: false });

      console.log('📋 Tous les abonnements:', allSubs);
      console.log('❌ Erreur tous abonnements:', allSubError);
      
      if (allSubs) {
        allSubscriptions = allSubs;
      }
    }

    return new Response(JSON.stringify({ 
      subscription: subscription || null,
      directSubscription: directSubscription || null,
      allSubscriptions: allSubscriptions,
      profile: {
        email: profile.email,
        stripe_customer_id: profile.stripe_customer_id,
        stripe_subscription_id: profile.stripe_subscription_id
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 