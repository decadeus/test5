"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProjectManager() {
  const supabase = createClientComponentClient();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupération de l'utilisateur et des projets
  useEffect(() => {
    const fetchUserAndProjects = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erreur récupération user", error);
        return;
      }
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("project")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erreur chargement projets", error);
        } else {
          setProjects(data);
        }
      }
    };

    fetchUserAndProjects();
  }, []);

  // Ajouter un projet
  const addProject = async () => {
    if (!newProjectName.trim()) {
      setError("Le nom du projet est requis.");
      return;
    }

    if (!user) {
      setError("Utilisateur non connecté.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("project")
      .insert([{ name: newProjectName, user_id: user.id }])
      .select();

    if (error) {
      setError("Erreur lors de l'ajout.");
      console.error(error);
    } else {
      setProjects([data[0], ...projects]);
      setNewProjectName("");
    }

    setLoading(false);
  };

  // Supprimer un projet
  const deleteProject = async (id) => {
    const { error } = await supabase.from("project").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression", error);
    } else {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <Card className="flex-1 shadow-md border border-gray-200 max-w-2xl mx-auto">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-2xl font-semibold">Projets ({projects.length})</h2>

        {/* Liste des projets */}
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md border border-gray-100"
            >
              <span className="text-sm text-gray-700">{project.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteProject(project.id)}
              >
                Supprimer
              </Button>
            </div>
          ))}
        </div>

        {/* Ajout d’un projet */}
        <div className="flex flex-col gap-3 mt-4">
          <Input
            placeholder="Nom du projet"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <Button onClick={addProject} disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
