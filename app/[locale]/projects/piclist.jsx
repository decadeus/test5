"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";

function Gallery({ city }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    const supabase = createClient();
    setLoading(true); // Activer le chargement

    let query = supabase
      .from("project")
      .select("created_at, mainpic_url")
      .order("created_at", { ascending: false });

    // Si city est défini, ajoutez la condition. Sinon, récupérez tous les projets.
    if (city) {
      query = query.eq("city", city);
    }

    const { data, error } = await query;

    if (error) {
      setError(error);
    } else {
      setProjects(data);
    }
    setLoading(false); // Désactiver le chargement
  };

  // Exécuter fetchProjects chaque fois que city change
  useEffect(() => {
    fetchProjects();
  }, [city]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ne pas rendre la grille si le tableau `projects` est vide
  if (projects.length === 0) {
    return <div>No images available</div>; // Ou un autre message ou rien
  }

  if (projects.length === 2) {
    return (
      <div className="grid grid-cols-2 grid-rows-1 gap-4 h-[600px] ">
        {/* La première image occupe deux colonnes et trois lignes */}
        <div className="">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url} // Image 1
              width={250}
              height={150}
              className="rounded-xl p-0 m-0"
            />
          </div>
        </div>

        {/* Les images suivantes */}
        {projects[1] && (
          <div className="">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[1]?.mainpic_url} // Image 2
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
       
      </div>
    );
  }

  if (projects.length === 3) {
    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] ">
        {/* La première image occupe deux colonnes et trois lignes */}
        <div className="col-span-2 row-span-2">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url} // Image 1
              width={250}
              height={150}
              className="rounded-xl p-0 m-0"
            />
          </div>
        </div>

        {/* Les images suivantes */}
        {projects[1] && (
          <div className="col-span-2 col-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[1]?.mainpic_url} // Image 2
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[2] && (
          <div className="col-span-2 col-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[2]?.mainpic_url} // Image 3
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (projects.length === 4) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[600px] ">
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

        {/* Les images suivantes */}
        {projects[1] && (
          <div className="col-span-2 col-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[1]?.mainpic_url} // Image 2
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[2] && (
          <div className="col-span-2 col-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[2]?.mainpic_url} // Image 3
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[3] && (
          <div className="col-span-2 col-start-3 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[3]?.mainpic_url} // Image 4
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[4] && (
          <div className="col-span-2 col-start-3 row-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[4]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (projects.length === 5) {
    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] ">
        {/* La première image occupe deux colonnes et trois lignes */}
        <div className="col-span-2 row-span-2">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url} // Image 1
              width={250}
              height={150}
              className="rounded-xl p-0 m-0"
            />
          </div>
        </div>

        {/* Les images suivantes */}
        {projects[1] && (
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
        )}
        {projects[2] && (
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
        )}
        {projects[3] && (
          <div className="col-start-3 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[3]?.mainpic_url} // Image 4
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[4] && (
          <div className="col-start-4 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[4]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (projects.length === 6) {
    return (
      <div className="grid grid-cols-3 grid-rows-4 gap-4 h-[600px] ">
        {/* La première image occupe deux colonnes et trois lignes */}
        <div className="col-span-2 row-span-2">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url} // Image 1
              width={250}
              height={150}
              className="rounded-xl p-0 m-0"
            />
          </div>
        </div>

        {/* Les images suivantes */}
        {projects[1] && (
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
        )}
        {projects[2] && (
          <div className="col-start-3 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[2]?.mainpic_url} // Image 3
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[3] && (
          <div className="row-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[3]?.mainpic_url} // Image 4
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[4] && (
          <div className="col-start-1 row-start-4">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[4]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[5] && (
          <div className="col-span-2 row-span-2 col-start-2 row-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[5]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (projects.length === 7) {
    return (
        
      <div className="grid grid-cols-6 grid-rows-3 gap-4 h-[600px] ">
        {/* La première image occupe deux colonnes et trois lignes */}
        <div className="col-span-3">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url} // Image 1
              width={250}
              height={150}
              className="rounded-xl p-0 m-0"
            />
          </div>
        </div>

        {/* Les images suivantes */}
        {projects[1] && (
          <div className="col-span-3 col-start-4">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[1]?.mainpic_url} // Image 2
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[2] && (
          <div className="col-span-2 row-span-2 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[2]?.mainpic_url} // Image 3
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[3] && (
          <div className="col-span-2 col-start-3 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[3]?.mainpic_url} // Image 4
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[4] && (
          <div className="col-span-2 col-start-3 row-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[4]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
        {projects[5] && (
          <div className="col-span-2 col-start-5 row-start-2">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[5]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
          {projects[6] && (
          <div className="col-span-2 col-start-5 row-start-3">
            <div className="relative h-full w-full">
              <Avatar
                url={projects[6]?.mainpic_url} // Image 5
                width={250}
                height={150}
                className="rounded-xl p-0 m-0"
              />
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <div></div>
  );
}

export default Gallery;
