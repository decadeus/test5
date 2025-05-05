import { NextResponse } from "next/server";
import OpenAI from "openai";

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
    let labels = {
      intro: "Rédige un texte professionnel pour présenter un projet immobilier :",
      nom: "Nom",
      localisation: "Localisation",
      types: "Types d'appartements",
      atouts: "Points forts",
      style: "Style architectural",
      cible: "Public cible",
      instruction: "Le texte doit être fluide, engageant et donner envie de découvrir le projet.",
      limite: "Limite à environ 800 caractères maximum.",
    };

    if (langue === "en") {
      labels = {
        intro: "Write a professional text to present a real estate project:",
        nom: "Name",
        localisation: "Location",
        types: "Types of apartments",
        atouts: "Key features",
        style: "Architectural style",
        cible: "Target audience",
        instruction: "The text must be fluent, engaging, and encourage discovery of the project.",
        limite: "Limit to around 800 characters maximum.",
      };
    } else if (langue === "pl") {
      labels = {
        intro: "Napisz profesjonalny tekst przedstawiający projekt nieruchomości:",
        nom: "Nazwa",
        localisation: "Lokalizacja",
        types: "Typy apartamentów",
        atouts: "Główne atuty",
        style: "Styl architektoniczny",
        cible: "Docelowa grupa odbiorców",
        instruction: "Tekst powinien być płynny, angażujący i zachęcający do odkrycia projektu.",
        limite: "Ogranicz do około 800 znaków.",
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
${labels.instruction}
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
