import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const testEmail = 'test@hoomge.com';
  const password = crypto.randomUUID();

  // Étape 1 : Crée un utilisateur
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password,
    email_confirm: true,
  });

  let userId = userData?.user?.id ?? null;

  // Si l'utilisateur existe déjà, on le récupère
  if (userError) {
    const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers({
      email: testEmail,
    });

    if (fetchError || !existingUser?.users?.length) {
      return new Response(JSON.stringify({ success: false, step: 'fetchUser', error: fetchError }), {
        status: 500,
      });
    }

    userId = existingUser.users[0].id;
  }

  // Étape 2 : Vérifie si un profil existe déjà
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (profileCheckError || !existingProfile) {
    const { data, error } = await supabase.from('profiles').insert([
      {
        id: userId,
        email: testEmail,
      },
    ]);

    if (error) {
      return new Response(JSON.stringify({ success: false, step: 'insertProfile', error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, userId, data }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ success: true, userId, note: 'Profil déjà existant' }), {
    status: 200,
  });
}