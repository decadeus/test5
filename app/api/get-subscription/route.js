import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

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

    if (profileError || !profile.stripe_customer_id) {
      return new Response(JSON.stringify({ error: 'Aucun profil trouvé' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer l'abonnement actif
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', profile.stripe_customer_id)
      .eq('is_active', true)
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Erreur lors de la récupération de l\'abonnement' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      subscription: subscription || null,
      profile: {
        email: profile.email,
        stripe_customer_id: profile.stripe_customer_id
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