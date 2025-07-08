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
  
  // Titre dynamique selon la langue
  const titleTemplates = {
    fr: `${project.name}, projet d'immeuble résidentiel à ${project.city} Pologne`,
    en: `${project.name}, residential building project in ${project.city} Poland`,
    pl: `${project.name}, projekt budynku mieszkalnego w ${project.city} Polska`,
    de: `${project.name}, Wohngebäudeprojekt in ${project.city} Polen`,
    ru: `${project.name}, проект жилого здания в ${project.city} Польша`,
    uk: `${project.name}, проект житлового будинку в ${project.city} Польща`
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
      canonical: `${baseUrl}/${lang}/Projet/Detail/${id}`,
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
