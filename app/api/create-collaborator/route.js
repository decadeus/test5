import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const supabase = createAdminClient();
  const serviceSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const body = await req.json();
  const { email, full_name, role, user_id } = body;

  if (!email || !full_name) {
    return NextResponse.json({ message: "Email et nom sont requis." }, { status: 400 });
  }

  // Limites par abonnement
  const subscriptionLimits = {
    'prod_SJ0eZqrhNInh0e': { collaborators: 6, projects: 5 },
    'prod_SIpRbNvkPezP4u': { collaborators: 1, projects: 1 },
    'prod_SJLg1bGI4Sfeqs': { collaborators: 11, projects: 10 },
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

    // 2. Compter les collaborateurs existants pour cet utilisateur
    const { count, error: countError } = await serviceSupabase
      .from('collaborators')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);
    if (countError) {
      return NextResponse.json({ message: "Erreur lors du comptage des collaborateurs." }, { status: 500 });
    }
    if (count >= limits.collaborators) {
      return NextResponse.json({ message: `Limite de collaborateurs atteinte (${limits.collaborators}).` }, { status: 403 });
    }

    // Vérifier si l'utilisateur existe déjà dans l'auth
    const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers({ email });
    let userId;
    if (fetchError) throw fetchError;
    const foundUser = existingUser && existingUser.users
      ? existingUser.users.find(u => u.email === email)
      : null;
    if (foundUser) {
      userId = foundUser.id;
    } else {
      // Créer l'utilisateur dans l'auth (compte actif immédiatement, mot de passe temporaire)
      const { data: userResult, error: userError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        password: '101080', // mot de passe temporaire
      });
      if (userError) throw userError;
      userId = userResult.user.id;
    }

    // Ajouter dans la table collaborators
    const [first_name, ...last_name_parts] = full_name.split(' ');
    const last_name = last_name_parts.join(' ');
    const { error: collabError } = await supabase.from("collaborators").insert({
      user_id,
      email,
      first_name,
      last_name,
      role: role || "collaborator",
    });
    if (collabError) throw collabError;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Erreur inconnue" }, { status: 400 });
  }
} 