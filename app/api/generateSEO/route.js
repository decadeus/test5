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

    // Génération dynamique des textes selon la langue pour une meta description SEO
    let labels = {
      intro: "Rédige une meta description SEO efficace pour un projet immobilier :",
      nom: "Nom",
      localisation: "Localisation",
      types: "Types d'appartements",
      atouts: "Points forts",
      style: "Style architectural",
      cible: "Public cible",
      instruction: "Le texte doit être concis, informatif et contenir des mots-clés pertinents pour améliorer le référencement naturel.",
      limite: "Maximum 160 caractères.",
    };

    if (langue === "en") {
      labels = {
        intro: "Write an effective SEO meta description for a real estate project:",
        nom: "Name",
        localisation: "Location",
        types: "Types of apartments",
        atouts: "Key features",
        style: "Architectural style",
        cible: "Target audience",
        instruction: "Text should be concise, informative and include relevant keywords to improve organic ranking.",
        limite: "Maximum 160 characters.",
      };
    } else if (langue === "pl") {
      labels = {
        intro: "Napisz skuteczny opis meta SEO dla projektu nieruchomości:",
        nom: "Nazwa",
        localisation: "Lokalizacja",
        types: "Typy apartamentów",
        atouts: "Główne atuty",
        style: "Styl architektoniczny",
        cible: "Docelowa grupa odbiorców",
        instruction: "Tekst powinien być zwięzły, informacyjny i zawierać odpowiednie słowa kluczowe dla poprawy pozycjonowania.",
        limite: "Maksymalnie 160 znaków.",
      };
    }

    const prompt = `
${labels.intro}
- ${labels.nom}: ${nomProjet}
- ${labels.localisation}: ${ville}
- ${labels.types}: ${types}
- ${labels.atouts}: ${atouts}
- ${labels.style}: ${style}
- ${labels.cible}: ${publicCible}
${labels.instruction} La ville doit être clairement mentionnée.
${labels.limite}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content.trim() || "";

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Erreur d'appel OpenAI:", error);
    return NextResponse.json({ text: "Erreur lors de la génération." }, { status: 500 });
  }
}
