import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { email, full_name, role, user_id } = body;

  if (!email || !full_name) {
    return NextResponse.json({ message: "Email et nom sont requis." }, { status: 400 });
  }

  try {
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