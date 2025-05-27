"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";
import Link from "next/link";

// Fonction utilitaire pour récupérer l'URL de l'image principale d'un projet
const getMainImageUrl = async (supabase, projectId) => {
  const { data: files, error: listError } = await supabase.storage.from("project").list(projectId);
  if (listError || !files) return null;

  const match = files
    .filter((f) => f.name.startsWith("image1-"))
    .sort((a, b) => b.name.localeCompare(a.name))[0];

  if (!match) return null;

  const path = `${projectId}/${match.name}`;
  const { data: fileData, error: downloadError } = await supabase.storage.from("project").download(path);
  if (downloadError || !fileData) return null;

  return URL.createObjectURL(fileData);
};

function Gallery({ city, compagny, project }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SBI = "bg-yellow-700 p-2 rounded-sm text-white";

  const fetchProjects = async () => {
    const supabase = createClient();
    setLoading(true); // Activer le chargement

    let query = supabase
      .from("project")
      .select("id, created_at, name, compagny, link, codepro")
      .eq("online", true)
      .order("created_at", { ascending: false })
      .limit(5);

    if (city) {
      query = query.eq("city", city);
    }

    const { data, error } = await query;

    if (error) {
      setError(error);
    } else if (data) {
      // Utilise la fonction utilitaire pour chaque projet
      const enriched = await Promise.all(
        data.map(async (project) => {
          const mainpic_url = await getMainImageUrl(supabase, project.id);
          return { ...project, mainpic_url };
        })
      );
      setProjects(enriched);
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

  if (projects.length === 1) {
    return (
      <div className="grid grid-cols-1 grid-rows-1 gap-2 sm:gap-4 h-[250px] sm:h-[400px] md:h-[600px]">
        <div className="w-full h-full">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url}
              width={250}
              height={150}
              className="rounded-lg sm:rounded-xl p-0 m-0"
            />
            <Link
              href={`/en/detailproject/${projects[0]?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
            >
              <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{projects[0]?.name}</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 2) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 h-[250px] sm:h-[400px] md:h-[600px]">
        {projects.map((project, index) => (
          <div key={index} className="w-full h-full">
            <div className="relative h-full w-full">
              <Avatar
                url={project?.mainpic_url}
                width={250}
                height={150}
                className="rounded-lg sm:rounded-xl p-0 m-0"
              />
              <Link
                href={`/en/detailproject/${project?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
              >
                <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{project?.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 h-[400px] sm:h-[500px] md:h-[600px]">
        <div className="sm:col-span-2 md:row-span-2 h-full">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url}
              width={250}
              height={150}
              className="rounded-lg sm:rounded-xl p-0 m-0"
            />
            <Link
              href={`/en/detailproject/${projects[0]?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
            >
              <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{projects[0]?.name}</p>
            </Link>
          </div>
        </div>
        {projects.slice(1).map((project, index) => (
          <div key={index} className="sm:col-span-1 md:col-span-2 h-full">
            <div className="relative h-full w-full">
              <Avatar
                url={project?.mainpic_url}
                width={250}
                height={150}
                className="rounded-lg sm:rounded-xl p-0 m-0"
              />
              <Link
                href={`/en/detailproject/${project?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
              >
                <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{project?.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 4) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 h-[400px] sm:h-[500px] md:h-[600px]">
        <div className="sm:col-span-2 md:col-span-2 md:row-span-2 h-full">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url}
              width={250}
              height={150}
              className="rounded-lg sm:rounded-xl p-0 m-0"
            />
            <Link
              href={`/en/detailproject/${projects[0]?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
            >
              <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{projects[0]?.name}</p>
            </Link>
          </div>
        </div>
        {projects.slice(1).map((project, index) => (
          <div key={index} className="sm:col-span-1 md:col-span-2 h-full">
            <div className="relative h-full w-full">
              <Avatar
                url={project?.mainpic_url}
                width={250}
                height={150}
                className="rounded-lg sm:rounded-xl p-0 m-0"
              />
              <Link
                href={`/en/detailproject/${project?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
              >
                <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{project?.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 5) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 h-[500px] sm:h-[600px] md:h-[700px]">
        <div className="sm:col-span-2 md:row-span-2 h-full">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url}
              width={250}
              height={150}
              className="rounded-lg sm:rounded-xl p-0 m-0"
            />
            <Link
              href={`/en/detailproject/${projects[0]?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
            >
              <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{projects[0]?.name}</p>
            </Link>
          </div>
        </div>
        {projects.slice(1).map((project, index) => (
          <div key={index} className="h-full">
            <div className="relative h-full w-full">
              <Avatar
                url={project?.mainpic_url}
                width={250}
                height={150}
                className="rounded-lg sm:rounded-xl p-0 m-0"
              />
              <Link
                href={`/en/detailproject/${project?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
              >
                <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{project?.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 6) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 h-[600px] sm:h-[700px] md:h-[800px]">
        <div className="sm:col-span-2 md:col-span-2 h-full">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url}
              width={250}
              height={150}
              className="rounded-lg sm:rounded-xl p-0 m-0"
            />
            <Link
              href={`/en/detailproject/${projects[0]?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
            >
              <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{projects[0]?.name}</p>
            </Link>
          </div>
        </div>

        {projects.slice(1, 3).map((project, index) => (
          <div key={index} className="md:col-start-3 h-full">
            <div className="relative h-full w-full">
              <Avatar
                url={project?.mainpic_url}
                width={250}
                height={150}
                className="rounded-lg sm:rounded-xl p-0 m-0"
              />
              <Link
                href={`/en/detailproject/${project?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
              >
                <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{project?.name}</p>
              </Link>
            </div>
          </div>
        ))}

        {projects.slice(3).map((project, index) => (
          <div key={index} className="h-full">
            <div className="relative h-full w-full">
              <Avatar
                url={project?.mainpic_url}
                width={250}
                height={150}
                className="rounded-lg sm:rounded-xl p-0 m-0"
              />
              <Link
                href={`/en/detailproject/${project?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
              >
                <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{project?.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 7) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 h-[700px] sm:h-[800px] md:h-[900px]">
        <div className="sm:col-span-3 md:col-span-3 h-full">
          <div className="relative h-full w-full">
            <Avatar
              url={projects[0]?.mainpic_url}
              width={250}
              height={150}
              className="rounded-lg sm:rounded-xl p-0 m-0"
            />
            <Link
              href={`/en/detailproject/${projects[0]?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
            >
              <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{projects[0]?.name}</p>
            </Link>
          </div>
        </div>

        {projects.slice(1).map((project, index) => (
          <div key={index} className="sm:col-span-1 md:col-span-2 h-full">
            <div className="relative h-full w-full">
              <Avatar
                url={project?.mainpic_url}
                width={250}
                height={150}
                className="rounded-lg sm:rounded-xl p-0 m-0"
              />
              <Link
                href={`/en/detailproject/${project?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-gray-50/20 transition-all duration-300 text-white rounded-lg sm:rounded-xl"
              >
                <p className="bg-yellow-700 px-2 py-1 sm:p-2 rounded-sm text-white text-sm sm:text-base">{project?.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function Textcp({ project, company }) {
  return (
    <div className="flex flex-col bg-gray-900/50 p-2 sm:p-3 backdrop-blur-sm">
      <p className="text-white text-sm sm:text-base font-medium truncate">{project}</p>
      <p className="text-white/80 text-xs sm:text-sm truncate">{company}</p>
    </div>
  );
}

export default Gallery;
