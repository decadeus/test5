import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { nomProjet, ville, types, atouts, style, publicCible, langue } = await req.json();

    if (!nomProjet || !ville || !types || !atouts || !style || !publicCible) {
      return NextResponse.json({ text: "Informations manquantes." }, { status: 400 });
    }

    // Génération dynamique des textes selon la langue
    const prompts = {
      fr: {
        intro: "Génère une meta description SEO optimisée pour un projet immobilier avec ces caractéristiques :",
        instruction: "La description doit :\n- Être limitée à 160 caractères maximum\n- Inclure la ville et le type de bien\n- Mettre en avant les points forts uniques\n- Utiliser des mots-clés immobiliers pertinents\n- Être attractive et incitative\n- Respecter la structure : [Type de bien] à [Ville] - [Points forts principaux]"
      },
      en: {
        intro: "Generate an optimized SEO meta description for a real estate project with these characteristics:",
        instruction: "The description must:\n- Be limited to 160 characters maximum\n- Include the city and property type\n- Highlight unique selling points\n- Use relevant real estate keywords\n- Be attractive and compelling\n- Follow the structure: [Property type] in [City] - [Main features]"
      },
      pl: {
        intro: "Wygeneruj zoptymalizowany opis meta SEO dla projektu nieruchomości o następujących cechach:",
        instruction: "Opis musi:\n- Być ograniczony do maksymalnie 160 znaków\n- Zawierać miasto i typ nieruchomości\n- Podkreślać unikalne punkty sprzedaży\n- Używać odpowiednich słów kluczowych\n- Być atrakcyjny i przekonujący\n- Zachować strukturę: [Typ nieruchomości] w [Miasto] - [Główne cechy]"
      }
    };

    const selectedPrompt = prompts[langue] || prompts.fr;

    const prompt = `
${selectedPrompt.intro}

PROJET: ${nomProjet}
VILLE: ${ville}
TYPES: ${types}
ATOUTS: ${atouts}
STYLE: ${style}
PUBLIC: ${publicCible}

${selectedPrompt.instruction}

IMPORTANT: La description générée doit être SEO-friendly et ne pas dépasser 160 caractères.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en SEO immobilier. Ta mission est de créer des meta descriptions optimisées pour le référencement naturel tout en restant attractives pour les utilisateurs."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const generatedText = completion.choices[0]?.message?.content.trim() || "";

    // Vérification de la longueur
    if (generatedText.length > 160) {
      return NextResponse.json({
        text: generatedText.substring(0, 157) + "..."
      });
    }

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Erreur d'appel OpenAI:", error);
    return NextResponse.json(
      { text: "Erreur lors de la génération de la description." },
      { status: 500 }
    );
  }
}
