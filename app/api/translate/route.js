import { NextResponse } from 'next/server';
import * as deepl from 'deepl-node';

export async function POST(request) {
  const { text, sourceLang, targetLangs } = await request.json();

  // Validation des paramètres
  if (!text || !sourceLang || !targetLangs || !Array.isArray(targetLangs)) {
    return NextResponse.json({ error: 'Paramètres manquants ou invalides' }, { status: 400 });
  }

  // Sécurise les codes langue
  const allowedLangs = ["EN-GB", "EN-US", "FR", "PL", "DE", "RU"];
  const langMap = { EN: "EN-GB", FR: "FR", PL: "PL", DE: "DE", RU: "RU", "EN-GB": "EN-GB", "EN-US": "EN-US" };
  const safeSourceLang = langMap[(typeof sourceLang === 'string' ? sourceLang.trim().toUpperCase() : "")] || "";
  if (!allowedLangs.includes(safeSourceLang)) {
    return NextResponse.json({ error: 'Langue source non supportée' }, { status: 400 });
  }
  const validTargetLangs = (targetLangs || [])
    .map(l => {
      const up = typeof l === 'string' ? l.trim().toUpperCase() : "";
      return langMap[up] || up;
    })
    .filter(l => allowedLangs.includes(l));
  console.log("DeepL: sourceLang=", safeSourceLang, "targetLangs=", validTargetLangs);
  if (!validTargetLangs.length) {
    return NextResponse.json({ error: 'Aucune langue cible valide' }, { status: 400 });
  }

  const auth_key = process.env.DEEPL_API_KEY;
  if (!auth_key) {
    return NextResponse.json({ error: 'Clé API DeepL non configurée' }, { status: 500 });
  }

  const translator = new deepl.Translator(auth_key);

  try {
    const results = await Promise.all(
      validTargetLangs.map(lang =>
        translator.translateText(text, safeSourceLang, lang)
      )
    );

    // Formatter la réponse pour être plus facile à utiliser côté client
    const translations = {};
    results.forEach((result, idx) => {
      // Utilise la langue cible demandée comme clé (ex: 'pl', 'fr', ...)
      const targetLang = validTargetLangs[idx].toLowerCase().split('-')[0];
      translations[targetLang] = result.text;
    });

    return NextResponse.json({ translations });

  } catch (error) {
    console.error('Erreur de traduction DeepL:', error);
    return NextResponse.json({ error: 'Échec de la traduction', details: error.message }, { status: 500 });
  }
} 