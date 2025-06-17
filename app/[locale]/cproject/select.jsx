"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Select({ user, Outprojects }) { // Renamed prop to `user`
  const supabase = createClient();
  const [projects, setProjects] = useState([]); // Renamed state to `projects`

  useEffect(() => {
    const fetchProjects = async () => {
      if (user && user.id) {  // Check if user and user.id exist
        const { data, error } = await supabase
          .from("project")
          .select(`*, projectlist(*)`)
          .eq("ide", user.id)  // Using `user.id` instead of `ide`
          .order("created_at", { ascending: false });

        if (error) {
          // console.error("Error fetching projects:", error);
        } else {
          setProjects(data);
        }
      }
    };

  

    fetchProjects();
  }, [user]); // Add `user` as a dependency to `useEffect`

  return (
    <>
      {projects.map((project) => (
        <div key={project.id} className="mb-8">
          <div>{project.name}</div>
        </div>
      ))}
    </>
  );
}
