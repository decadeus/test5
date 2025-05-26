import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { projectId, langue = "fr" } = await request.json();

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Missing projectId' }), { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('project')
      .select('coam, fulldescr, city')
      .eq('id', projectId)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }

    const { coam, fulldescr, city } = data;

    const fullText = `${coam || ""} ${fulldescr || ""} À ${city}.`.replace(/\s+/g, " ").trim();

    const promptMetaDescription = `
Génère une meta description courte (max 150 caractères) en ${langue} à partir du contenu suivant :
"${fullText}"
Le texte doit contenir le nom de la ville (${city}), être fluide et terminé correctement.
`;

    const completionMetaDescription = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptMetaDescription }],
      temperature: 0.7,
    });

    const generatedText = completionMetaDescription.choices[0]?.message?.content.trim() || "";

    const promptTitle = `
Génère un titre court (max 60 caractères) en ${langue} pour une page projet immobilier à ${city}, basé sur ce contenu :
"${fullText}"
`;

    const completionTitle = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptTitle }],
      temperature: 0.7,
    });

    const generatedTitle = completionTitle.choices[0]?.message?.content.trim() || "";

    return new Response(JSON.stringify({ metaDescription: generatedText, title: generatedTitle }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("Erreur serveur :", err);
    return new Response(JSON.stringify({ error: 'Erreur serveur.' }), { status: 500 });
  }
}