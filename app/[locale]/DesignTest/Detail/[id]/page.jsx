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

  return {
    title: project.name,
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
