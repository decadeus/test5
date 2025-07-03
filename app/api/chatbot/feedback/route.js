import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { question, answer, email } = body;
    const supabase = createClient();
    const { data, error } = await supabase.from('chatbot_feedback').insert([
      { question, answer, email }
    ]);
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('API feedback exception:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    console.log('Feedback API PATCH received:', body);
    const { question, answer, is_like, email } = body;
    const supabase = createClient();
    // On met à jour la ligne qui correspond à la même question, answer, email et is_like null
    const { data, error } = await supabase.from('chatbot_feedback')
      .update({ is_like })
      .eq('question', question)
      .eq('answer', answer)
      .eq('email', email)
      .is('is_like', null);
    console.log('Supabase PATCH result:', { data, error });
    if (error) {
      console.error('Supabase PATCH error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('API feedback PATCH exception:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
} 