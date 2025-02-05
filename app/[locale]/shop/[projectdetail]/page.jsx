"use client";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const { projectdetail } = useParams();
  const supabase = createClient();
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const fetchValue = async () => {
      if (!projectdetail) return;

      const { data, error } = await supabase
        .from("project")
        .select()
        .eq("codepro", projectdetail)
        .single(); // On récupère un seul projet correspondant au slug

      if (error) {
        console.error("Erreur de récupération :", error);
      } else {
        setProjectData(data);
      }
    };

    fetchValue();
  }, [projectdetail, supabase]);

  return (
    <div className="mt-24 px-6">
      <h1 className="text-4xl font-bold">Shop Page</h1>

      {projectData ? (
        <>
          <p className="text-xl text-red-300">Pays: {projectData.country || "Non défini"}</p>
          <p className="text-2xl font-semibold mt-4">
            Slug: <span className="text-blue-600">{projectdetail}</span>
          </p>
        </>
      ) : (
        <p className="text-gray-500 mt-4">Chargement des données...</p>
      )}
    </div>
  );
}
