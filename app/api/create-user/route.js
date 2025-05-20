import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // ton client Supabase avec service_role

export async function POST(req) {
  const supabase = createClient();
  const body = await req.json();
  const { email, password, username, full_name } = body;

  try {
    // 1. Créer l'utilisateur dans auth
    const { data: userResult, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    if (userError) throw userError;

    const user = userResult.user;

    // 2. Insérer le profil lié à l'id du user auth
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email,
      username,
      full_name,
    });

    if (profileError) throw profileError;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Erreur inconnue" }, { status: 400 });
  }
}
