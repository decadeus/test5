import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("project")
    .select("name, coam, fulldescr, city")
    .eq("id", params.projectdetail)
    .single();

  if (!data) {
    return {
      title: "Détails du projet",
      description: "Découvrez les détails de ce projet résidentiel.",
    };
  }

  const { name, coam, fulldescr, city } = data;

  return {
    title: `${name} - ${city} | ${coam}`,
    description: fulldescr?.slice(0, 1500) || "Découvrez ce projet immobilier résidentiel situé à " + city + ".",
  };
}