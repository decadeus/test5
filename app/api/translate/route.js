import { NextResponse } from 'next/server';
import * as deepl from 'deepl-node';

// Fonction de mapping robuste pour DeepL
function mapLangCode(lang) {
  if (!lang) return '';
  const l = lang.toLowerCase();
  if (l === 'en' || l === 'en-gb') return 'EN-GB';
  if (l === 'en-us') return 'EN-US';
  if (l.startsWith('fr')) return 'FR';
  if (l.startsWith('pl')) return 'PL';
  if (l.startsWith('de')) return 'DE';
  if (l.startsWith('ru')) return 'RU';
  if (l.startsWith('uk')) return 'UK';
  return lang.toUpperCase();
}

export async function POST(request) {
  const { text, sourceLang, targetLangs } = await request.json();

  // Validation des paramètres
  if (!text || !sourceLang || !targetLangs || !Array.isArray(targetLangs)) {
    return NextResponse.json({ error: 'Paramètres manquants ou invalides' }, { status: 400 });
  }

  // Mapping des codes langue pour DeepL
  const safeSourceLang = mapLangCode(sourceLang);
  const validTargetLangs = (targetLangs || []).map(mapLangCode);
  const allowedLangs = ["EN-GB", "EN-US", "FR", "PL", "DE", "RU", "UK"];
  if (!allowedLangs.includes(safeSourceLang)) {
    return NextResponse.json({ error: 'Langue source non supportée' }, { status: 400 });
  }
  const filteredTargetLangs = validTargetLangs.filter(l => allowedLangs.includes(l));
  console.log("DeepL: sourceLang=", safeSourceLang, "targetLangs=", filteredTargetLangs);
  if (!filteredTargetLangs.length) {
    return NextResponse.json({ error: 'Aucune langue cible valide' }, { status: 400 });
  }

  const auth_key = process.env.DEEPL_API_KEY;
  if (!auth_key) {
    return NextResponse.json({ error: 'Clé API DeepL non configurée' }, { status: 500 });
  }

  const translator = new deepl.Translator(auth_key);

  try {
    const results = await Promise.all(
      filteredTargetLangs.map(lang =>
        translator.translateText(text, safeSourceLang, lang)
      )
    );

    // Formatter la réponse pour être plus facile à utiliser côté client
    const translations = {};
    results.forEach((result, idx) => {
      // Utilise la langue cible demandée comme clé (ex: 'pl', 'fr', ...)
      const targetLang = filteredTargetLangs[idx].toLowerCase();
      translations[targetLang] = result.text;
    });

    return NextResponse.json({ translations });

  } catch (error) {
    console.error('Erreur de traduction DeepL:', error);
    return NextResponse.json({ error: 'Échec de la traduction', details: error.message }, { status: 500 });
  }
} 