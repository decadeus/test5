"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";

export default function Summer({ country }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("country", country)
        .eq("beau", true)

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
  }, [country]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const styler = "relative h-40  w-full";

  return (
    <div>
      <div className="grid grid-cols-6 grid-rows-2 gap-4 w-full">
        {projects.length === 0 ? (
          <div className="col-span-6">No projects found</div>
        ) : (
          <>
            {projects[0] && (
              <div className={`col-span-3 ${styler}`}>
                <Avatar
                  url={projects[0].mainpic_url}
                  width={270}
                  height={196}
                  className="rounded-sm"
                />
              </div>
            )}
            {projects[1] && (
              <div className={`col-span-3 col-start-4 ${styler}`}>
               <Avatar
                  url={projects[1].mainpic_url}
                  width={270}
                  height={196}
                  className="rounded-sm"
                />
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
                <Avatar
                  url={projects[3].mainpic_url}
                  width={270}
                  height={196}
                  className="rounded-sm"
                />
              </div>
            )}
            {projects[4] && (
              <div className={`col-span-2 col-start-5 row-start-2 ${styler}`}>
                <Avatar
                  url={projects[4].mainpic_url}
                  width={270}
                  height={196}
                  className="rounded-sm"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
