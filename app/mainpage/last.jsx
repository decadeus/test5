"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";
import { projectIcons } from "@/lib/iconbuilding"; // Mettez ici le chemin correct vers projectIcons.js

export default function Last({ country }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null); // Manage hover state outside the map

  // Dynamically fetch the bgmapColor from the CSS file
  const bgmapColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--bgmap-color")
    .trim();

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: true })
        .eq("country", country)
        .limit(3);

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, [country]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const decorateFirstLetter = (text) => {
    if (!text) return null;
    return (
      <>
        <span
          style={{
            fontSize: "2em",
            color:
              text.charAt(0) === "B"
                ? "#86BC23"
                : text.charAt(0) === "E"
                ? "#f50e02"
                : "#FFD700", // Default color if not B or C
            fontWeight: "bold",
          }}
        >
          {text.charAt(0)}
        </span>
        {text.slice(1)}
      </>
    );
  };

  return (
    <div className="w-full">
      {projects.length > 0 ? (
        <div className="flex justify-between w-full ">
          {projects.map((project) => (
            <div key={project.id} className="relative w-1/3 mx-4 group">
              <div className="relative h-60 z-0">
                <Avatar
                  url={project.mainpic_url}
                  width={270}
                  height={196}
                  classn="rounded-sm"
                  classNamed="object-position-1"
                />
                <h3
                  className="absolute bottom-0 w-fit text-white px-2 rounded-sm text-sm -mb-2 ml-2 z-20"
                  style={{ backgroundColor: bgmapColor }}
                >
                  {decorateFirstLetter(project.compagny)}
                </h3>

                {/* Le div qui s'assombrit et affiche un lien au centre */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 ">
                  <a
                    href={project.link}
                    className="text-lg font-semibold bg-transparent text-white py-2 px-2 rounded-md border-white border-2 transition-colors duration-300 ease-in-out hover:bg-white hover:text-black"
                  >
                    See project
                  </a>
                </div>
              </div>

              <div className="bg-gray-100 pt-4 px-2 pb-4">
                <div className="flex justify-between">
                  <p className="font-bold">{project.name}</p>
                  <div className="relative flex space-x-4">
                    {projectIcons.map(
                      ({ key, icon: Icon, label }) =>
                        project[key] && (
                          <div
                            key={key}
                            className="relative inline-block"
                            onMouseEnter={() => setHoveredIcon(key)}
                            onMouseLeave={() => setHoveredIcon(null)}
                          >
                            <Icon
                              color={bgmapColor}
                              style={{ cursor: "pointer" }}
                            />
                            {hoveredIcon === key && (
                              <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded-md">
                                {label}
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <p>{project.adresse}</p>
                  <p>{project.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No projects found.</div>
      )}
    </div>
  );
}
