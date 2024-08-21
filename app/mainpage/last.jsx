"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/Ugetone";

export default function Summer() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project")
        .select("created_at, compagny, mainpic_url")
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

  const styler = "border-2 border-black rounded-sm h-44 ";

  return (
    <div>
      <div className="grid grid-cols-6 grid-rows-2 gap-4 w-full">
        {projects.length === 0 ? (
          <div className="col-span-6">No projects found</div>
        ) : (
          <>
            {projects[0] && (
              <div className={`col-span-3 ${styler}`}>{projects[0].compagny}</div>
            )}
            {projects[1] && (
              <div
                className={`col-span-3 col-start-4 ${styler}`}
              >
               <p> {projects[1].compagny}</p>
              </div>
            )}
            {projects[2] && (
              <div className={`col-span-2 row-start-2  ${styler}`}>
               
                <div className="h-full w-full">
                  <Avatar
                    url={projects[2].mainpic_url}
                    width={270}
                    height={196}
                    className="rounded-sm"
                  />
                </div>
              </div>
            )}
            {projects[3] && (
              <div className={`col-span-2 col-start-3 row-start-2  ${styler}`}>
                {projects[3].compagny}
              </div>
            )}
            {projects[4] && (
              <div className={`col-span-2 col-start-5 row-start-2 ${styler}`}>
                {projects[4].compagny}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
