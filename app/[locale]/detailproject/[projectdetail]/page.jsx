import ListProjectPage from "./ListProjectPage";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("project")
    .select("name, des")
    .eq("codepro", params.projectdetail)
    .single();

  return {
    title: data?.name || "Project Title",
    description: data?.des || "Project Details",
  };
}

export default function ProjectPage({ params }) {
  return <ListProjectPage projectdetail={params.projectdetail} />;
}
