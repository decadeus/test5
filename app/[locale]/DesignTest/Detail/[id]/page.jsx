import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import DetailClient from "./DetailClient";

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

  return {
    title,
    description,
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

  if (!project) return <div>Projet introuvable</div>;

  return <DetailClient project={project} locale={locale} />;
}
