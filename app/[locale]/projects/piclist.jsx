"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("created_at, mainpic_url")
      .order("created_at", { ascending: false }); // Tri par date de création

    if (error) {
      setError(error);
    } else {
      setProjects(data); // Assigner directement les données des projets
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
