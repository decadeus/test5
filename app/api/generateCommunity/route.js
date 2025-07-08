import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { listEquipement, detail, langue } = await req.json();

    if (!listEquipement || !detail || !langue) {
      return NextResponse.json(
        { text: "Informations manquantes." },
        { status: 400 }
      );
    }

    let labels = {
      intro: "Rédige un texte professionnel pour présenter les avantages des équipements collectifs dans un projet immobilier :",
      listEquipement: "Liste des équipements",
      detail: "Informations supplémentaires",
      instruction: "Le texte doit être fluide, engageant et donner envie de découvrir le projet.",
      limite: "Le texte doit faire entre 700 et 900 caractères, jamais moins de 700, jamais plus de 900 (tronque si besoin).",
    };

    if (langue === "en") {
      labels = {
        intro: "Write a professional text to present the advantages of community amenities in a real estate project:",
        listEquipement: "List of amenities",
        detail: "Additional important information",
        instruction: "The text must be fluent, engaging, and encourage discovery of the project.",
        limite: "The text must be between 700 and 900 characters, never less than 700, never more than 900 (truncate if needed).",
      };
    } else if (langue === "pl") {
      labels = {
        intro: "Napisz profesjonalny tekst przedstawiający zalety udogodnień społecznych w projekcie nieruchomości:",
        listEquipement: "Lista udogodnień",
        detail: "Dodatkowe ważne informacje",
        instruction: "Tekst powinien być płynny, angażujący i zachęcający do zapoznania się z projektem.",
        limite: "Tekst musi mieć od 700 do 900 znaków, nigdy mniej niż 700, nigdy więcej niż 900 (obciąć w razie potrzeby).",
      };
    } else if (langue === "uk") {
      labels = {
        intro: "Напишіть професійний текст для представлення переваг спільних зручностей у проекті нерухомості:",
        listEquipement: "Список зручностей",
        detail: "Додаткові важливі відомості",
        instruction: "Текст повинен бути плавним, захоплюючим та заохочувати до знайомства з проектом.",
        limite: "Текст повинен містити від 700 до 900 символів, ніколи не менше 700, ніколи не більше 900 (обрізати за потреби).",
      };
    }

    const prompt = `
${labels.intro}
- ${labels.listEquipement}: ${listEquipement}
- ${labels.detail}: ${detail}

${labels.instruction}
${labels.limite}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const generatedText = completion.choices[0]?.message?.content.trim() || "";

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    return NextResponse.json(
      { text: "Erreur lors de la génération." },
      { status: 500 }
    );
  }
}
