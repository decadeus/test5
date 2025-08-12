import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import DetailClient from "./DetailClient";
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Chatbot from "../../../../components/Chatbot";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id, locale } = params;
  const supabase = createClient();
  const { data: project } = await supabase
    .from("project")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    return {
      title: "Projet introuvable",
      description: "Aucune description disponible.",
    };
  }

  const lang = locale || 'fr';
  const description = project[`des_${lang}`] || project.des_fr || '';

  // === Nouveau: pays dynamique localisé à partir de project.country ===
  const rawCountry = (project.country || '').trim().toLowerCase();
  const COUNTRY_SYNONYMS = {
    // Pologne
    'poland': 'PL', 'polska': 'PL', 'pologne': 'PL', 'polen': 'PL', 'польша': 'PL', 'польща': 'PL',
    // France
    'france': 'FR', 'français': 'FR', 'francja': 'FR', 'frankreich': 'FR', 'франция': 'FR', 'франція': 'FR',
    // Monaco
    'monaco': 'MC',
  };
  const COUNTRY_NAME_MAP = {
    PL: { fr: 'Pologne', en: 'Poland', pl: 'Polska', de: 'Polen', ru: 'Польша', uk: 'Польща' },
    FR: { fr: 'France', en: 'France', pl: 'Francja', de: 'Frankreich', ru: 'Франция', uk: 'Франція' },
    MC: { fr: 'Monaco', en: 'Monaco', pl: 'Monako', de: 'Monaco', ru: 'Монако', uk: 'Монако' },
  };
  const normalizedCountryCode = COUNTRY_SYNONYMS[rawCountry] || null;
  const localizedCountry = normalizedCountryCode
    ? (COUNTRY_NAME_MAP[normalizedCountryCode][lang] || COUNTRY_NAME_MAP[normalizedCountryCode]['en'])
    : (project.country || '');
  const countryPart = localizedCountry ? ` ${localizedCountry}` : '';
  // === Fin pays dynamique ===
  
  // Titre dynamique selon la langue (injection du pays localisé)
  const titleTemplates = {
    fr: `${project.name}, projet d'immeuble résidentiel à ${project.city}${countryPart}`,
    en: `${project.name}, residential building project in ${project.city}${countryPart}`,
    pl: `${project.name}, projekt budynku mieszkalnego w ${project.city}${countryPart}`,
    de: `${project.name}, Wohngebäudeprojekt in ${project.city}${countryPart}`,
    ru: `${project.name}, проект жилого здания в ${project.city}${countryPart}`,
    uk: `${project.name}, проект житлового будинку в ${project.city}${countryPart}`
  };
  
  const title = titleTemplates[lang] || titleTemplates.fr;

  // Générer les URLs alternatives pour hreflang
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  
  const supportedLocales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'];
  const alternates = {};
  
  supportedLocales.forEach(loc => {
    alternates[`${loc}`] = `${baseUrl}/${loc}/Projet/Detail/${id}`;
  });

  return {
    title,
    description,
    alternates: {
      
      languages: alternates,
    },
  };
}

export default async function DetailPage({ params }) {
  const { id, locale } = params;
  const supabase = createClient();
  const { data: project } = await supabase
    .from("project")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return (
    <>
      <DetailClient project={project} locale={locale} />
      <Chatbot />
    </>
  );
}
