import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const serviceSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const body = await req.json();
  const { name, user_id } = body;

  if (!name || !user_id) {
    return NextResponse.json({ message: "Nom du projet et user_id requis." }, { status: 400 });
  }

  // Limites par abonnement
  const subscriptionLimits = {
    'prod_SJ0eZqrhNInh0e': { collaborators: 6, projects: 5 },
    'prod_SIpRbNvkPezP4u': { collaborators: 1, projects: 1 },
    'prod_SJLg1bGI4Sfeqs': { collaborators: 11, projects: 10 },
    'prod_SdPzE3lkSWgpK2': { collaborators: 11, projects: 10 }, // 180€ (10 projets)
    'prod_SdPwqOxfZGldXt': { collaborators: 6, projects: 5 },   // 120€ (5 projets)
    'prod_SdPsYyqcyWXp8d': { collaborators: 1, projects: 1 },   // 35€ (1 projet)
  };

  try {
    // 1. Récupérer le product_id d'abonnement de l'utilisateur
    const { data: profile, error: profileError } = await serviceSupabase
      .from('profiles')
      .select('stripe_subscription_id')
      .eq('id', user_id)
      .single();
    if (profileError || !profile?.stripe_subscription_id) {
      return NextResponse.json({ message: "Aucun abonnement trouvé pour cet utilisateur." }, { status: 403 });
    }
    const { data: subscription, error: subError } = await serviceSupabase
      .from('subscriptions')
      .select('product_id')
      .eq('id', profile.stripe_subscription_id)
      .eq('is_active', true)
      .single();
    if (subError || !subscription?.product_id) {
      return NextResponse.json({ message: "Aucun abonnement actif trouvé." }, { status: 403 });
    }
    const limits = subscriptionLimits[subscription.product_id];
    if (!limits) {
      return NextResponse.json({ message: "Aucune limite définie pour cet abonnement." }, { status: 403 });
    }

    // 2. Compter les projets existants pour cet utilisateur
    const { count, error: countError } = await serviceSupabase
      .from('project')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);
    if (countError) {
      return NextResponse.json({ message: "Erreur lors du comptage des projets." }, { status: 500 });
    }
    if (count >= limits.projects) {
      return NextResponse.json({ message: `Limite de projets atteinte (${limits.projects}).` }, { status: 403 });
    }

    // Ajouter le projet
    const { data, error: insertError } = await serviceSupabase
      .from('project')
      .insert([{ name, user_id }])
      .select();
    if (insertError) {
      return NextResponse.json({ message: insertError.message || "Erreur lors de l'ajout." }, { status: 400 });
    }
    return NextResponse.json({ success: true, project: data[0] });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Erreur inconnue" }, { status: 400 });
  }
} 