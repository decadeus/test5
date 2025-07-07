"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Limites d'abonnement par product_id
const subscriptionLimits = {
  'prod_SJ0eZqrhNInh0e': { collaborators: 6, projects: 5 },
  'prod_SIpRbNvkPezP4u': { collaborators: 1, projects: 1 },
  'prod_SJLg1bGI4Sfeqs': { collaborators: 11, projects: 10 },
  'prod_SdPzE3lkSWgpK2': { collaborators: 11, projects: 10 }, // 180€ (10 projets)
  'prod_SdPwqOxfZGldXt': { collaborators: 6, projects: 5 },   // 120€ (5 projets)
  'prod_SdPsYyqcyWXp8d': { collaborators: 1, projects: 1 },   // 35€ (1 projet)
};

export default function ProjectManager({ t }) {
  const supabase = createClientComponentClient();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [maxCollaborators, setMaxCollaborators] = useState(5);
  const [subscriptionProductId, setSubscriptionProductId] = useState(null);
  const [maxProjects, setMaxProjects] = useState(null);

  // Récupération de l'utilisateur, des projets et du product_id d'abonnement
  useEffect(() => {
    const fetchUserAndProjects = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return;
      }
      setUser(user);

      if (user) {
        // Récupérer les projets
        const { data, error } = await supabase
          .from("project")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error) setProjects(data);

        // Récupérer les collaborateurs
        const { data: collabs, error: collabError } = await supabase
          .from("collaborators")
          .select("*")
          .eq("user_id", user.id);
        if (!collabError) setCollaborators(collabs);

        // Récupérer le product_id d'abonnement
        try {
          const res = await fetch(`/api/get-subscription?userId=${user.id}`);
          const subData = await res.json();
          let productId = null;
          if (subData?.subscription?.product_id) productId = subData.subscription.product_id;
          else if (subData?.directSubscription?.product_id) productId = subData.directSubscription.product_id;
          else if (Array.isArray(subData?.allSubscriptions)) {
            // Prendre le premier abonnement actif
            const active = subData.allSubscriptions.find(sub => sub.is_active && sub.status === 'active');
            if (active?.product_id) productId = active.product_id;
          }
          setSubscriptionProductId(productId);
          if (productId && subscriptionLimits[productId]) {
            setMaxProjects(subscriptionLimits[productId].projects);
            setMaxCollaborators(subscriptionLimits[productId].collaborators);
          } else {
            setMaxProjects(null);
            setMaxCollaborators(5);
          }
        } catch (e) {
          setMaxProjects(null);
          setMaxCollaborators(5);
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
    if (maxProjects !== null && projects.length >= maxProjects) {
      setError(`Limite de projets atteinte (${maxProjects}). Veuillez mettre à niveau votre abonnement.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProjectName, user_id: user.id })
      });
      let result = {};
      try {
        result = await res.json();
      } catch (e) {
        setError("Erreur lors de l'ajout (réponse invalide)");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(result.message || JSON.stringify(result) || "Erreur lors de l'ajout.");
      } else {
        setProjects([result.project, ...projects]);
        setNewProjectName("");
      }
    } catch (e) {
      setError(e.message || "Erreur lors de l'ajout.");
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

  const addCollaborator = async () => {
    if (
      collaborators.length < maxCollaborators &&
      newEmail &&
      newFirstName &&
      newLastName &&
      user
    ) {
      // Validation de l'email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(newEmail)) {
        setError("Veuillez entrer une adresse e-mail valide.");
        return;
      }
  
      // 1. Ajout dans la table collaborators
      const { data, error } = await supabase
        .from("collaborators")
        .insert([
          {
            user_id: user.id,
            email: newEmail,
            first_name: newFirstName,
            last_name: newLastName,
          },
        ])
        .select();
  
      if (error) {
        console.error("Erreur insertion", error);
        setError("Erreur lors de l'ajout du collaborateur.");
        return;
      } else {
        setCollaborators([...collaborators, data[0]]);
        setNewEmail("");
        setNewFirstName("");
        setNewLastName("");
      }
  
      // 2. Envoi du Magic Link
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: newEmail,
        options: {
          // redirectTo: "https://ton-app.com/chemin-apres-login" // optionnel
        }
      });
  
      if (magicLinkError) {
        console.error("Erreur envoi magic link:", magicLinkError);
        setError("Erreur lors de l'envoi du lien magique.");
      } else {
        alert("Un email d'invitation a été envoyé au collaborateur !");
      }
    } else {
      setError("Vous ne pouvez pas ajouter plus de collaborateurs.");
    }
  };

  // Supprimer un collaborateur
  const deleteCollaborator = async (id) => {
    const { error } = await supabase
      .from("collaborators")
      .delete()
      .eq("id", id);
    if (!error) {
      setCollaborators(collaborators.filter((c) => c.id !== id));
    }
  };

  // Affichage conditionnel pour éviter le flash de mauvaise valeur
  if (maxProjects === null || maxCollaborators === null) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <Card className="flex-1 shadow-md border border-gray-200 max-w-2xl mx-auto">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-2xl font-semibold">{t('projects')} ({projects.length}/{maxProjects ?? '-'})</h2>

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
                {t('delete')}
              </Button>
            </div>
          ))}
        </div>

        {/* Ajout d'un projet */}
        <div className="flex flex-col gap-3 mt-4">
          {projects.length >= maxProjects ? (
            <p className="text-sm text-red-600 font-semibold">{t('limit_projects_reached')}</p>
          ) : (
            <>
              <Input
                placeholder={t('project_name')}
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button onClick={addProject} disabled={loading}>
                {loading ? t('adding') : t('add')}
              </Button>
            </>
          )}
        </div>

        {error && <p className="text-sm text-red-900">{t('error')}</p>}
      </CardContent>
    </Card>
  );
}
