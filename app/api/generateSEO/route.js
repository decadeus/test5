import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Déclaration de config accessible partout
const config = {
  full: {
    instruction:
      "Le texte doit être fluide, engageant et donner envie de découvrir le projet. Commence la description de façon originale, évite les débuts classiques comme 'Découvrez...'. Incluez les avantages de la résidence et son positionnement géographique.",
    limite:
      "Limite stricte à 1400 caractères maximum pour une description complète. Ne dépasse jamais cette limite (tronque si besoin).",
  },
};

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
          intro: `À partir du nom du projet, de sa ville, de sa description et de ses équipements, rédige une meta description SEO parfaite (entre 120 et 140 caractères, jamais plus de 140). Commence la phrase de façon originale, évite les formules classiques comme 'Découvrez le projet immobilier...'. Sois créatif, professionnel, optimisé pour le référencement, et veille à ce que la description ne dépasse JAMAIS 140 caractères (tronque si besoin).`,
          projet: "Description complète du projet",
          amenities: "Équipements et avantages",
          nom: "Nom du projet",
          ville: "Ville",
        },
        en: {
          intro: `Based on the project name, city, description, and amenities, write a perfect SEO meta description (between 120 and 140 characters, never more than 140). Start the sentence in an original way, avoid classic formulas like 'Discover the real estate project...'. Be creative, professional, SEO-optimized, and make sure the description NEVER exceeds 140 characters (truncate if needed).`,
          projet: "Full project description",
          amenities: "Amenities and advantages",
          nom: "Project name",
          ville: "City",
        },
        pl: {
          intro: `Na podstawie nazwy projektu, miasta, opisu i udogodnień napisz idealny metaopis SEO (między 120 a 140 znaków, nigdy więcej niż 140). Zacznij zdanie w oryginalny sposób, unikaj klasycznych formuł typu 'Odkryj projekt nieruchomości...'. Bądź kreatywny, profesjonalny, zoptymalizowany pod SEO i upewnij się, że opis NIGDY nie przekracza 140 znaków (skróć w razie potrzeby).`,
          projet: "Pełny opis projektu",
          amenities: "Udogodnienia i zalety",
          nom: "Nazwa projektu",
          ville: "Miasto",
        },
        de: {
          intro: `Erstelle anhand des Projektnamens, der Stadt, der Beschreibung und der Ausstattungen eine perfekte SEO-Meta-Beschreibung (zwischen 120 und 140 Zeichen, niemals mehr als 140). Beginne den Satz originell, vermeide klassische Formulierungen wie 'Entdecken Sie das Immobilienprojekt...'. Sei kreativ, professionell, SEO-optimiert und achte darauf, dass die Beschreibung NIEMALS 140 Zeichen überschreitet (bei Bedarf kürzen).`,
          projet: "Vollständige Projektbeschreibung",
          amenities: "Ausstattung und Vorteile",
          nom: "Projektname",
          ville: "Stadt",
        },
        ru: {
          intro: `На основе названия проекта, города, описания и удобств напишите идеальное SEO-метаописание (от 120 до 140 символов, никогда не более 140). Начните предложение оригинально, избегайте классических формул типа 'Откройте для себя жилой проект...'. Будьте креативны, профессиональны, оптимизированы для SEO и убедитесь, что описание НИКОГДА не превышает 140 символов (при необходимости сократите).`,
          projet: "Полное описание проекта",
          amenities: "Удобства и преимущества",
          nom: "Название проекта",
          ville: "Город",
        },
        uk: {
          intro:
            "Напишіть професійний текст для презентації житлового проекту:",
          nom: "Назва",
          localisation: "Місцезнаходження",
          types: "Типи квартир",
          atouts: "Ключові особливості",
          style: "Архітектурний стиль",
          cible: "Цільова аудиторія",
          instruction: config.full.instruction,
          limite: config.full.limite,
        },
      };

      const currentLabels = labels[langue] || labels.fr;

      // Ajout d'une consigne explicite de langue à la fin du prompt
      const languageInstructions = {
        fr: "Réponds uniquement en français !",
        en: "Answer only in English!",
        pl: "Odpowiedz wyłącznie po polsku!",
        de: "Antworte ausschließlich auf Deutsch!",
        ru: "Отвечай только по-русски!",
        uk: "Відповідай тільки українською!",
      };
      const langInstruction = languageInstructions[langue] || languageInstructions.fr;

      prompt = `
${currentLabels.intro}

Contexte:
- ${currentLabels.nom}: ${nomProjet}
- ${currentLabels.ville}: ${ville}
- ${currentLabels.projet}: ${projectDescription}
- ${currentLabels.amenities}: ${communityAmenities}

${langInstruction}
`;
      max_tokens = 120;
    } else {
      // Logique existante pour la description complète
      const { nomProjet, ville, types, atouts, style, publicCible } = body;
      if (!nomProjet || !ville || !types || !atouts || !style || !publicCible) {
        return NextResponse.json(
          { text: "Informations manquantes pour la description complète." },
          { status: 400 }
        );
      }

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
        en: {
          intro:
            "Write a professional text to present a real estate project:",
          nom: "Name",
          localisation: "Location",
          types: "Apartment types",
          atouts: "Key features",
          style: "Architectural style",
          cible: "Target audience",
          instruction: config.full.instruction,
          limite: config.full.limite,
        },
        pl: {
          intro:
            "Napisz profesjonalny tekst prezentujący projekt nieruchomości:",
          nom: "Nazwa",
          localisation: "Lokalizacja",
          types: "Typy apartamentów",
          atouts: "Główne cechy",
          style: "Styl architektoniczny",
          cible: "Grupa docelowa",
          instruction: config.full.instruction,
          limite: config.full.limite,
        },
        de: {
          intro:
            "Verfasse einen professionellen Text zur Präsentation eines Immobilienprojekts:",
          nom: "Name",
          localisation: "Standort",
          types: "Wohnungstypen",
          atouts: "Hauptmerkmale",
          style: "Architekturstil",
          cible: "Zielgruppe",
          instruction: config.full.instruction,
          limite: config.full.limite,
        },
        ru: {
          intro:
            "Напишите профессиональный текст для презентации жилого проекта:",
          nom: "Название",
          localisation: "Местоположение",
          types: "Типы квартир",
          atouts: "Ключевые особенности",
          style: "Архитектурный стиль",
          cible: "Целевая аудитория",
          instruction: config.full.instruction,
          limite: config.full.limite,
        },
        uk: {
          intro:
            "Напишіть професійний текст для презентації житлового проекту:",
          nom: "Назва",
          localisation: "Місцезнаходження",
          types: "Типи квартир",
          atouts: "Ключові особливості",
          style: "Архітектурний стиль",
          cible: "Цільова аудиторія",
          instruction: config.full.instruction,
          limite: config.full.limite,
        },
      };

      const currentLabels = labels[langue] || labels.fr;

      // Pour la partie "full"
      const langInstructionFull = languageInstructions[langue] || languageInstructions.fr;
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

${langInstructionFull}
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
