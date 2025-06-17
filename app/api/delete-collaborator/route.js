import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { id, email } = body;

  if (!id || !email) {
    return NextResponse.json({ message: "id et email sont requis." }, { status: 400 });
  }

  try {
    // 1. Supprimer dans l'auth Supabase
    // Chercher l'utilisateur par email
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers({ email });
    if (fetchError) throw fetchError;
    const foundUser = users && users.users ? users.users.find(u => u.email === email) : null;
    if (foundUser) {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(foundUser.id);
      if (deleteAuthError) throw deleteAuthError;
    }
    // 2. Supprimer dans la table collaborators
    const { error: collabError } = await supabase.from("collaborators").delete().eq("id", id);
    if (collabError) throw collabError;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Erreur inconnue" }, { status: 400 });
  }
} 