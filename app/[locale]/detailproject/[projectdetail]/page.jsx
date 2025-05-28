import { createClient } from "@/utils/supabase/server";
import ListProjectPage from "./ListProjectPage";

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const projectId = parseInt(params.projectdetail, 10);

  if (isNaN(projectId)) return {};

  try {
    const { data, error } = await supabase
      .from("project")
      .select("title, des")
      .eq("id", projectId)
      .single();

    if (error || !data) throw error;

    return {
      title: data.title || "Projet immobilier",
      description: data.des || "",
    };
  } catch (error) {
    console.error("Erreur lors de la génération des métadonnées :", error);
    return {
      title: "Projet immobilier",
      description: "",
    };
  }
}

export default function ProjectPage({ params }) {
  return <ListProjectPage projectdetail={params.projectdetail} />;
}