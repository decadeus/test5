import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { nomProjet, ville, langue } = await req.json();

    if (!nomProjet || !ville) {
      return NextResponse.json({ text: "Informations manquantes." }, { status: 400 });
    }

    // Génération dynamique des textes selon la langue
    const prompts = {
      fr: {
        intro: "Génère un titre SEO optimisé pour un projet immobilier résidentiel :",
        instruction: "Le titre doit :\n- Être limité à 60 caractères maximum\n- Inclure le nom du projet et la ville\n- Mentionner qu'il s'agit d'un projet résidentiel\n- Être attractif et optimisé pour le référencement\n- Structure recommandée : [Nom du Projet] | Résidence à [Ville]"
      },
      en: {
        intro: "Generate an optimized SEO title for a residential real estate project:",
        instruction: "The title must:\n- Be limited to 60 characters maximum\n- Include project name and city\n- Mention it's a residential project\n- Be attractive and SEO optimized\n- Recommended structure: [Project Name] | Residence in [City]"
      },
      pl: {
        intro: "Wygeneruj zoptymalizowany tytuł SEO dla projektu mieszkaniowego:",
        instruction: "Tytuł musi:\n- Być ograniczony do 60 znaków\n- Zawierać nazwę projektu i miasto\n- Wskazywać, że to projekt mieszkaniowy\n- Być atrakcyjny i zoptymalizowany pod SEO\n- Zalecana struktura: [Nazwa Projektu] | Mieszkania w [Miasto]"
      }
    };

    const selectedPrompt = prompts[langue] || prompts.fr;

    const prompt = `
${selectedPrompt.intro}

PROJET: ${nomProjet}
VILLE: ${ville}

${selectedPrompt.instruction}

IMPORTANT: Le titre généré doit être SEO-friendly et ne pas dépasser 60 caractères.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en SEO immobilier spécialisé dans la création de titres optimisés. Ta mission est de créer des titres courts, percutants et optimisés pour le référencement."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 50,
    });

    const generatedText = completion.choices[0]?.message?.content.trim() || "";

    // Vérification de la longueur
    if (generatedText.length > 60) {
      return NextResponse.json({
        text: generatedText.substring(0, 57) + "..."
      });
    }

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Erreur d'appel OpenAI:", error);
    return NextResponse.json(
      { text: "Erreur lors de la génération du titre." },
      { status: 500 }
    );
  }
}
