export async function generateMetadata({ params }) {
  
  
    const supabase = createClient();
    const { data } = await supabase
      .from("project")
      .select("name")
      .eq("codepro", params.projectdetail)
      .single();
  
  
    return {
      title: data?.name || "Project Details",
    };
  }
  