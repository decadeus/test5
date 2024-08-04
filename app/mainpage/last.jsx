"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Summer() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projectlist")
        .select("ref, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const styler = "border-2 border-black rounded-lg p-4";

  return (
    <div>
      <div className="grid grid-cols-6 grid-rows-2 gap-4 w-full">
        {projects.length === 0 ? (
          <div className="col-span-6">No projects found</div>
        ) : (
          <>
            {projects[0] && (
              <div className={`col-span-3 ${styler}`}>{projects[0].ref}</div>
            )}
            {projects[1] && (
              <div
                className={`col-span-3 col-start-4 ${styler}`}
              >
                {projects[1].ref}
              </div>
            )}
            {projects[2] && (
              <div className={`col-span-2 row-start-2  ${styler}`}>
                {projects[2].ref}
              </div>
            )}
            {projects[3] && (
              <div className={`col-span-2 col-start-3 row-start-2  ${styler}`}>
                {projects[3].ref}
              </div>
            )}
            {projects[4] && (
              <div className={`col-span-2 col-start-5 row-start-2 ${styler}`}>
                {projects[4].ref}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
