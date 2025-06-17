"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function PermissionMatrix({ user, collaborators, projects }) {
  const supabase = createClientComponentClient();
  const [accessMap, setAccessMap] = useState({});

  useEffect(() => {
    const fetchAccess = async () => {
      if (!user || projects.length === 0 || collaborators.length === 0) return;

      const projectIds = projects.map((p) => p.id);
      const collabIds = collaborators.map((c) => c.id);

      const { data, error } = await supabase
        .from("collaborator_project_access")
        .select("*")
        .in("project_id", projectIds)
        .in("collaborator_id", collabIds);

      if (error) {
        return;
      }

      const map = {};
      data.forEach((entry) => {
        map[`${entry.collaborator_id}-${entry.project_id}`] = entry.can_edit;
      });
      setAccessMap(map);
    };

    fetchAccess();
  }, [user, projects, collaborators]);

  const toggleAccess = async (collaboratorId, projectId) => {
    const key = `${collaboratorId}-${projectId}`;
    const current = accessMap[key] || false;
    const newValue = !current;

    setAccessMap({ ...accessMap, [key]: newValue });

    const { data: existing, error: selectError } = await supabase
      .from("collaborator_project_access")
      .select("id")
      .eq("collaborator_id", collaboratorId)
      .eq("project_id", projectId)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      return;
    }

    if (existing) {
      const { error } = await supabase
        .from("collaborator_project_access")
        .update({ can_edit: newValue })
        .eq("id", existing.id);
    } else {
      const { error } = await supabase.from("collaborator_project_access").insert([
        {
          collaborator_id: collaboratorId,
          project_id: projectId,
          can_edit: true,
        },
      ]);
    }
  };

  return (
<Card className="shadow-md border border-gray-200">
  <CardContent className="p-6">
    <h2 className="text-xl font-semibold mb-4">Droits d'accès des collaborateurs</h2>

    <div className="overflow-x-auto w-full">
  <table className="table-auto min-w-[1000px] border-collapse text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="sticky left-0 bg-gray-100 z-10 text-left p-2 border-r w-48">
              Collaborateur
            </th>
            {projects.map((project) => (
              <th
                key={project.id}
                className="text-center p-2 border-r whitespace-nowrap min-w-[150px] max-w-[200px] truncate"
                title={project.name}
              >
                {project.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collaborators.map((collab) => (
            <tr key={collab.id} className="border-t">
              <td className="sticky left-0 bg-white z-10 p-2 border-r w-48 font-medium text-gray-800">
                {collab.first_name} {collab.last_name}
              </td>
              {projects.map((project) => {
                const key = `${collab.id}-${project.id}`;
                const checked = !!accessMap[key];

                return (
                  <td key={project.id} className="text-center p-2 border-r">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        toggleAccess(collab.id, project.id)
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>



  );
}
