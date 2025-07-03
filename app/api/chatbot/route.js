import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { getInstructionsForQuestion } from './instructionRouter';

export async function POST(req) {
  const { messages, faq, email } = await req.json();
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  // Récupère dynamiquement les instructions pertinentes
  const dynamicInstructions = getInstructionsForQuestion(lastUserMessage);

  const systemMessage = {
    role: "system",
    content: `\nTu es un assistant immobilier.\nFAQ : ${faq || ""}${dynamicInstructions}\nSois professionnel et concis.\n`
  };

  const enrichedMessages = [systemMessage, ...messages];

  const apiKey = process.env.OPENAI_API_KEY;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: enrichedMessages,
      max_tokens: 200,
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "Désolé, une erreur est survenue.";

  // Enregistrement dans Supabase si email fourni
  if (email && email.includes('@')) {
    try {
      const supabase = createClient();
      await supabase.from('chatbot_feedback').insert([
        {
          email,
          question: lastUserMessage,
          answer: reply,
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (e) {
      console.error("Erreur lors de l'enregistrement du log chatbot", e);
    }
  }

  return NextResponse.json({ reply });
} 