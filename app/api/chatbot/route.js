import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req) {
  const { messages, faq, email } = await req.json();
  const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

  // Bloc d'explication SEO multilingue
  let seoMetadataInfo = "";
  if (
    lastUserMessage.includes("seo") ||
    lastUserMessage.includes("référencement") ||
    lastUserMessage.includes("moteur de recherche") ||
    lastUserMessage.includes("meta") ||
    lastUserMessage.includes("balise") ||
    lastUserMessage.includes("langue") ||
    lastUserMessage.includes("language")
  ) {
    seoMetadataInfo = `\nSi l'utilisateur pose des questions sur le référencement (SEO) multilingue ou la gestion des langues :\n- Explique que les balises <title> et <meta name=\"description\"> sont générées dynamiquement selon la langue.\n- Précise que chaque projet possède une description SEO traduite dans plusieurs langues.\n- Indique que des balises hreflang et un sitemap multilingue sont utilisés pour optimiser l'indexation par Google et les moteurs de recherche.\n- Mentionne que chaque langue a son propre préfixe d'URL, ce qui améliore le référencement local et l'expérience utilisateur.`;
  }

  // Bloc d'explication Abonnement
  let abonnementInfo = "";
  if (
    lastUserMessage.includes("abonnement") ||
    lastUserMessage.includes("souscription") ||
    lastUserMessage.includes("abonner") ||
    lastUserMessage.includes("abonnements") ||
    lastUserMessage.includes("subscription") ||
    lastUserMessage.includes("subscribe")
  ) {
    abonnementInfo = `\nSi l'utilisateur pose des questions sur les abonnements :\n- Explique qu'il existe plusieurs formules d'abonnement pour accéder à des fonctionnalités avancées du site.\n- Précise que l'abonnement permet de bénéficier de services supplémentaires, comme la gestion de projets, l'accès à des outils d'IA, ou des fonctionnalités réservées aux membres.\n- Indique que l'utilisateur peut souscrire, modifier ou annuler son abonnement à tout moment depuis son espace personnel.\n- Mentionne que le paiement est sécurisé et que l'utilisateur peut contacter le support en cas de question.`;
  }

  // Bloc d'explication sur la création de hoomge.com
  let hoomgeInfo = "";
  if (
    lastUserMessage.includes("créateur") ||
    lastUserMessage.includes("fondateur") ||
    lastUserMessage.includes("qui a créé") ||
    lastUserMessage.includes("qui a cree") ||
    lastUserMessage.includes("origine") ||
    lastUserMessage.includes("hoomge.com") ||
    lastUserMessage.includes("hoomge")
  ) {
    hoomgeInfo = `\nSi l'utilisateur pose des questions sur l'origine ou la création de hoomge.com :\n- Explique que hoomge.com a été créé par Johann, un entrepreneur passionné d'immobilier et de technologie, avec l'objectif de faciliter la recherche et la gestion de projets immobiliers neufs à l'international.\n- Précise que la plateforme vise à offrir une expérience innovante, multilingue et accessible à tous les utilisateurs, promoteurs comme particuliers.`;
  }

  const systemMessage = {
    role: "system",
    content: `\nTu es un assistant immobilier.\nFAQ : ${faq || ""}${seoMetadataInfo}${abonnementInfo}${hoomgeInfo}\nSois professionnel et concis.\n`
  };

  const enrichedMessages = [systemMessage, ...messages];

  const apiKey = process.env.OPENAI_API_KEY;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: enrichedMessages,
      max_tokens: 200,
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "Désolé, une erreur est survenue.";

  // Enregistrement dans Supabase si email fourni
  if (email && email.includes('@')) {
    try {
      const supabase = createClient();
      await supabase.from('chatbot_logs').insert([
        {
          email,
          question: lastUserMessage,
          answer: reply,
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (e) {
      console.error("Erreur lors de l'enregistrement du log chatbot", e);
    }
  }

  return NextResponse.json({ reply });
} 