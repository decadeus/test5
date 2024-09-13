"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";


export default function MostBeauty({ country }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project")
        .select("*")
        .eq("country", country)
        .eq("beau", true)
        .limit(3); // Filter by selected country

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, [country]); // Re-fetch projects when country changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ScrollArea className="w-full ">
        <div className="flex w-max space-x-4">
          {projects.length === 0 ? (
            <div>No projects found</div>
          ) : (
            projects.map((item, index) => (
              <div
                key={index}
                className="flex flex-col w-fit gap-4 mt-4 shadow-lg p-4 rounded-sm flex-wrap"
              >
                 <div className="relative h-40  w-[300px]">
                  <Avatar
                    url={item.mainpic_url}
                    width={270}
                    height={196}
                    className="rounded-sm"
                  />
                </div>
              
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
