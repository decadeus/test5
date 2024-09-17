"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiPersonSimpleSwimDuotone } from "react-icons/pi";
import { IoIosFitness } from "react-icons/io";
import { BiHandicap } from "react-icons/bi";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { BiCctv } from "react-icons/bi";
import { BiDoorOpen } from "react-icons/bi"; 

export default function Summer({ country }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null); // Manage hover state outside the map

  // Dynamically fetch the bgmapColor from the CSS file
  const bgmapColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bgmap-color')
    .trim();

  // Array of project icons and their labels
  const projectIcons = [
    { key: 'swim', icon: PiPersonSimpleSwimDuotone, label: 'Swim' },
    { key: 'child', icon: IoGameControllerOutline, label: 'Child' },
    { key: 'fitness', icon: IoIosFitness, label: 'Fitness' },
    { key: 'disabled', icon: BiHandicap, label: 'Disabled' },
    { key: 'bike', icon: MdOutlineDirectionsBike, label: 'Bike' },
    { key: 'cctv', icon: BiCctv, label: 'CCTV' },
    { key: 'entrance', icon: BiDoorOpen, label: 'Entrance' }
  ];

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

  return (
    <div className="w-full">

      {projects.length > 0 ? (
        <div className="flex justify-between w-full ">
          {projects.map((project) => (
            <div key={project.id} className="relative w-1/3 mx-4 ">
              <div className="relative h-60 z-0">
                <Avatar
                  url={project.mainpic_url}
                  width={270}
                  height={196}
                  classn="rounded-sm"
                  classNamed="object-position-1"
                />
                {/* Position the company name absolutely over the Avatar */}
                <h3
                  className="absolute bottom-0 w-fit text-white px-2 rounded-sm text-sm -mb-2 ml-2 z-20"
                  style={{ backgroundColor: bgmapColor }}
                >
                  {project.compagny}
                </h3>
              </div>
              <div className="bg-gray-100 pt-4 px-2 pb-4">
                <div className="flex justify-between">
                <p className="font-bold">{project.name}</p>
                <div className="relative flex space-x-4">
                  {projectIcons.map(({ key, icon: Icon, label }) => (
                    project[key] && (
                      <div
                        key={key}
                        className="relative inline-block"
                        onMouseEnter={() => setHoveredIcon(key)}
                        onMouseLeave={() => setHoveredIcon(null)}
                      >
                        {/* Render the icon */}
                        <Icon color={bgmapColor} style={{ cursor: "pointer" }} />
                        {/* Render the tooltip on hover */}
                        {hoveredIcon === key && (
                          <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded-md">
                            {label}
                          </div>
                        )}
                      </div>
                    )
                  ))}
                </div>
                </div>
                <div className="flex gap-2">
                  <p>{project.adresse}</p>
                  <p>{project.city}</p>
                </div>

                {/* Render the project icons */}
                
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
