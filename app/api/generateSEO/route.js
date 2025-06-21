import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { type = "full", langue = "fr" } = body;

    let prompt;
    let max_tokens;

    if (type === "short") {
      const {
        projectDescription,
        communityAmenities,
        nomProjet,
        ville,
      } = body;

      if (!projectDescription && !communityAmenities) {
        return NextResponse.json(
          { text: "La description du projet ou les équipements sont requis." },
          { status: 400 }
        );
      }

      const labels = {
        fr: {
          intro: `À partir du nom du projet, de sa ville, de sa description et de ses équipements, rédige une meta description SEO parfaite (entre 120 et 140 caractères). Elle doit être très accrocheuse, professionnelle et optimisée pour le référencement.`,
          projet: "Description complète du projet",
          amenities: "Équipements et avantages",
          nom: "Nom du projet",
          ville: "Ville",
        },
        // ... (autres langues si nécessaire)
      };

      const currentLabels = labels[langue] || labels.fr;

      prompt = `
${currentLabels.intro}

Contexte:
- ${currentLabels.nom}: ${nomProjet}
- ${currentLabels.ville}: ${ville}
- ${currentLabels.projet}: ${projectDescription}
- ${currentLabels.amenities}: ${communityAmenities}
`;
      max_tokens = 80;
    } else {
      // Logique existante pour la description complète
      const { nomProjet, ville, types, atouts, style, publicCible } = body;
      if (!nomProjet || !ville || !types || !atouts || !style || !publicCible) {
        return NextResponse.json(
          { text: "Informations manquantes pour la description complète." },
          { status: 400 }
        );
      }

      const config = {
        full: {
          instruction:
            "Le texte doit être fluide, engageant et donner envie de découvrir le projet. Incluez les avantages de la résidence et son positionnement géographique.",
          limite:
            "Limite à 1200-1400 caractères maximum pour une description complète.",
        },
      };

      const labels = {
        fr: {
          intro:
            "Rédige un texte professionnel pour présenter un projet immobilier :",
          nom: "Nom",
          localisation: "Localisation",
          types: "Types d'appartements",
          atouts: "Points forts",
          style: "Style architectural",
          cible: "Public cible",
          instruction: config.full.instruction,
          limite: config.full.limite,
        },
        // ... (autres langues)
      };

      const currentLabels = labels[langue] || labels.fr;

      prompt = `
${currentLabels.intro}
- ${currentLabels.nom}: ${nomProjet}
- ${currentLabels.localisation}: ${ville}
- ${currentLabels.types}: ${types}
- ${currentLabels.atouts}: ${atouts}
- ${currentLabels.style}: ${style}
- ${currentLabels.cible}: ${publicCible}
${currentLabels.instruction}
${currentLabels.limite}
`;
      max_tokens = 1000;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: max_tokens,
    });

    const generatedText = completion.choices[0]?.message?.content.trim() || "";

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Erreur génération IA:", error);
    return NextResponse.json(
      { text: "Erreur lors de la génération." },
      { status: 500 }
    );
  }
}
