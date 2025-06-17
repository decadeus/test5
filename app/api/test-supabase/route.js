import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { data, error } = await supabase.from('test_logins').select('*').limit(1);
  if (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
}