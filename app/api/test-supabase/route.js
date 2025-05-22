import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  console.log('🔗 Test Supabase SELECT');
  const { data, error } = await supabase.from('test_logins').select('*').limit(1);
  if (error) {
    console.error('❌ Supabase SELECT Failed:', error);
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
  console.log('✅ Supabase SELECT OK');
  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
}