"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";

function Gallery({ country }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    const supabase = createClient();
    setLoading(true);  // Activer le chargement

    let query = supabase
      .from("project")
      .select("created_at, mainpic_url")
      .order("created_at", { ascending: false });

    // Si country est défini, ajoutez la condition. Sinon, récupérez tous les projets.
    if (country) {
      query = query.eq("country", country);
    }

    const { data, error } = await query;

    if (error) {
      setError(error);
    } else {
      setProjects(data); 
    }
    setLoading(false);  // Désactiver le chargement
  };

  // Exécuter fetchProjects chaque fois que le pays change
  useEffect(() => {
    fetchProjects(); // Appeler fetchProjects directement, car il gère la logique du pays
  }, [country]);  // Relancer l'effet à chaque changement du pays

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-4 h-[800px]">
      {projects.length > 0 && (
        <>
          {/* La première image occupe deux colonnes et trois lignes */}
          <div className="col-span-2 row-span-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[0]?.mainpic_url} // Image 1
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>

          {/* Les images suivantes sont positionnées spécifiquement */}
          <div className="col-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[1]?.mainpic_url} // Image 2
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
          <div className="col-start-4">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[2]?.mainpic_url} // Image 3
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
          <div className="col-start-4 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[3]?.mainpic_url} // Image 4
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
          <div className="col-start-3 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[4]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
          <div className="col-span-2 row-span-2 col-start-3 row-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[5]?.mainpic_url} // Image 6
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
          <div className="col-span-2 row-span-2 row-start-4">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[6]?.mainpic_url} // Image 7
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
          <div className="col-start-3 row-start-5">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[7]?.mainpic_url} // Image 8
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
          <div className="col-start-4 row-start-5">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[8]?.mainpic_url} // Image 9
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;
