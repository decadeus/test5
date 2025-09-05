import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import DetailClient from "../DetailClient";
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Chatbot from "../../../../components/Chatbot";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug, locale } = params;
  const supabase = createClient();
  
  // Récupérer le projet par slug
  const { data: project } = await supabase
    .from("project")
    .select("*")
    .eq("slug", slug)
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
  
  // Compter le nombre d'appartements (lots) associés au projet
  const { count: projectlistCount } = await supabase
    .from('projectlist')
    .select('id', { count: 'exact', head: true })
    .eq('ide', project.id);

  const apartmentsCount = projectlistCount || 0;

  // Titre dynamique selon la langue (injection du pays localisé + nb d'appartements)
  const titleTemplates = {
    fr: `${apartmentsCount} ${apartmentsCount > 1 ? "appartements neufs" : "appartement neuf"} à ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    en: `${apartmentsCount} ${apartmentsCount === 1 ? "new apartment" : "new apartments"} in ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    pl: `${apartmentsCount} ${apartmentsCount === 1 ? "nowe mieszkanie" : "nowe mieszkania"} w ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    de: `${apartmentsCount} ${apartmentsCount === 1 ? "neue Wohnung" : "neue Wohnungen"} in ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    ru: `${apartmentsCount} ${apartmentsCount === 1 ? "новая квартира" : "новые квартиры"} в ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    uk: `${apartmentsCount} ${apartmentsCount === 1 ? "нова квартира" : "нові квартири"} у ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`
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
    alternates[`${loc}`] = `${baseUrl}/${loc}/Projet/Detail/${slug}`;
  });

  const ogUrl = `${baseUrl}/${lang}/Projet/Detail/${slug}`;
  const ogImage = (project.avatar && project.avatar.startsWith('http'))
    ? project.avatar
    : `${baseUrl}/appart.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: ogUrl,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      url: ogUrl,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: lang,
      siteName: 'Hoomge',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug, locale } = params;
  const supabase = createClient();

  // Récupérer le projet par slug
  const { data: project, error } = await supabase
    .from("project")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    console.error('Project not found:', error);
    notFound();
  }

  return (
    <>
      <DetailClient project={project} locale={locale} />
      <Chatbot />
    </>
  );
}
