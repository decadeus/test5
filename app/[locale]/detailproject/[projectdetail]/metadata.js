export async function generateMetadata({ params }) {
    console.log("Fetching metadata for:", params.projectdetail);
  
    const supabase = createClient();
    const { data } = await supabase
      .from("project")
      .select("name")
      .eq("codepro", params.projectdetail)
      .single();
  
    console.log("Fetched project data:", data);
  
    return {
      title: data?.name || "Project Details",
    };
  }
  