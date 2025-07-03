import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req) {
  const { answer, is_like, email, created_at } = await req.json();
  const supabase = createClient();
  const { error } = await supabase.from('chatbot_feedback').insert([
    { answer, is_like, email, created_at }
  ]);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 