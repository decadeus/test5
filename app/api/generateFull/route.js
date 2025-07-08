import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  const { projectName, language, userPrompt } = await request.json();

  if (!projectName || !language) {
    return NextResponse.json({ error: 'projectName et language sont requis' }, { status: 400 });
  }

  // Construction du prompt IA
  let prompt = `Rédige une description professionnelle et attractive pour un projet immobilier nommé "${projectName}".`;
  if (userPrompt && userPrompt.trim().length > 0) {
    prompt += ` Prends en compte les indications suivantes : ${userPrompt.trim()}.`;
  }
  prompt += ` La description doit être en ${language}, faire entre 700 et 900 caractères, et donner envie de découvrir le projet.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es un expert en rédaction immobilière.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 900,
      temperature: 0.8,
    });
    return NextResponse.json({ choices: completion.choices });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération IA', details: error.message }, { status: 500 });
  }
} 