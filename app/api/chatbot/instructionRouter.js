import seoMetadataInfo from './instructions/seo';
import abonnementInfo from './instructions/abonnement';
import origineInfo from './instructions/origine';
import magiclinkInfo from './instructions/magiclink';

const instructionMap = [
  { keywords: ["seo", "référencement", "meta", "langue", "language", "balise", "moteur de recherche"], getInfo: seoMetadataInfo },
  { keywords: ["abonnement", "souscription", "abonner", "abonnements", "subscription", "subscribe"], getInfo: abonnementInfo },
  { keywords: ["créateur", "fondateur", "qui a créé", "qui a cree", "origine", "hoomge.com", "hoomge"], getInfo: origineInfo },
  { keywords: ["magic link", "lien magique", "connexion sans mot de passe", "login sans mot de passe", "magiclink"], getInfo: magiclinkInfo },
  // Ajoute d'autres blocs ici si besoin
];

export function getInstructionsForQuestion(question) {
  let instructions = "";
  const lowerQuestion = question.toLowerCase();
  for (const { keywords, getInfo } of instructionMap) {
    if (keywords.some(kw => lowerQuestion.includes(kw))) {
      instructions += getInfo();
    }
  }
  return instructions;
} 