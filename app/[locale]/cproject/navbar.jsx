"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaCreditCard, FaUsers, FaShieldAlt, FaBuilding } from "react-icons/fa";
import CollaboratorManager from "./ProjetManagement";
import ProjectForm from "./ProjectForm";
import PermissionMatrix from "./PermissionMatrix";
import FullDetail from "./fulldetail";
import Projectb from "./projectb";
import Generale from "./generale";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTranslations } from "next-intl";

export default function Layout() {
  const supabase = createClientComponentClient();
  const t = useTranslations("Navbar");

  const [activeView, setActiveView] = useState("collaborators");
  const [selectedProject, setSelectedProject] = useState(null);
  const [user, setUser] = useState(null);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [isPromoteur, setIsPromoteur] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [projects, setProjects] = useState([]);

  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const subscriptionLimits = {
    'prod_SJ0eZqrhNInh0e': { collaborators: 6, projects: 5 },
    'prod_SIpRbNvkPezP4u': { collaborators: 1, projects: 1 },
    'prod_SJLg1bGI4Sfeqs': { collaborators: 11, projects: 10 },
    'prod_SdPzE3lkSWgpK2': { collaborators: 11, projects: 10 }, // 180€ (10 projets)
    'prod_SdPwqOxfZGldXt': { collaborators: 6, projects: 5 },   // 120€ (5 projets)
    'prod_SdPsYyqcyWXp8d': { collaborators: 1, projects: 1 },   // 35€ (1 projet)
  };
  const [subscriptionProductId, setSubscriptionProductId] = useState(null);
  const [maxCollaborators, setMaxCollaborators] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        return;
      }

      setUser(user);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.role === "promoteur") {
        setIsPromoteur(true);
      } else {
        setIsPromoteur(false);
      }

      const { data: collabRecord } = await supabase
        .from("collaborators")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      const isCollab = !!collabRecord;
      setIsCollaborator(isCollab);

      if (isCollab && collabRecord?.id) {
        const { data: access } = await supabase
          .from("collaborator_project_access")
          .select("project(*)")
          .eq("collaborator_id", collabRecord.id)
          .eq("can_edit", true);

        setProjects(access?.map((a) => a.project) || []);
      } else {
        const { data: projs, error: projError } = await supabase
          .from("project")
          .select("*")
          .eq("user_id", user.id);

        if (projError) {
        } else {
          const projectIds = (projs || []).map(p => p.id);

          // Ajout récupération des accès et enrichissement avec editorCount
          const { data: accessList } = await supabase
            .from("collaborator_project_access")
            .select("project_id,can_edit")
            .in("project_id", projectIds);
            
          const { data: apartmentsData } = await supabase
            .from('projectlist')
            .select('project_id')
            .in('project_id', projectIds);

          const projectsWithEditors = (projs || []).map((p) => {
            const editors = accessList?.filter(
              (a) => a.project_id === p.id && a.can_edit
            );
            const apartments = apartmentsData?.filter(
              (a) => a.project_id === p.id
            );
            return { 
                ...p, 
                editorCount: editors?.length ?? 0,
                apart_count: apartments?.length ?? 0
            };
          });

          setProjects(projectsWithEditors);
        }

        const { data: collabs, error: collabError } = await supabase
          .from("collaborators")
          .select("*")
          .eq("user_id", user.id);

        if (collabError) {
        } else {
          setCollaborators(collabs || []);
        }
      }

      // Récupérer le product_id d'abonnement
      try {
        const res = await fetch(`/api/get-subscription?userId=${user.id}`);
        const subData = await res.json();
        let productId = null;
        if (subData?.subscription?.product_id) productId = subData.subscription.product_id;
        else if (subData?.directSubscription?.product_id) productId = subData.directSubscription.product_id;
        else if (Array.isArray(subData?.allSubscriptions)) {
          const active = subData.allSubscriptions.find(sub => sub.is_active && sub.status === 'active');
          if (active?.product_id) productId = active.product_id;
        }
        setSubscriptionProductId(productId);
        if (productId && subscriptionLimits[productId]) {
          setMaxCollaborators(subscriptionLimits[productId].collaborators);
        } else {
          setMaxCollaborators(5);
        }
      } catch (e) {
        setMaxCollaborators(5);
      }
    };

    fetchAll();
  }, []);

  const addCollaborator = async () => {
    if (
      collaborators.length < maxCollaborators &&
      newEmail &&
      newFirstName &&
      newLastName &&
      user
    ) {
      let errorMsg = "";
      let successMsg = "";
      try {
        const res = await fetch("/api/create-collaborator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: newEmail,
            full_name: `${newFirstName} ${newLastName}`,
            role: "collaborator",
            user_id: user.id,
          }),
        });
        const result = await res.json();
        if (res.ok) {
          setNewEmail("");
          setNewFirstName("");
          setNewLastName("");
          // Rafraîchir la liste des collaborateurs
          const { data: collabs, error: collabError } = await supabase
            .from("collaborators")
            .select("*")
            .eq("user_id", user.id);
          if (!collabError) setCollaborators(collabs || []);
          successMsg =
            "Invitation envoyée ! Le collaborateur recevra un email avec un lien d'accès. Son compte sera créé lorsqu'il cliquera sur ce lien pour la première fois.";
        } else {
          errorMsg =
            result.message || "Erreur lors de la création du collaborateur.";
        }
      } catch (err) {
        errorMsg = err.message;
      }
      setShowSuccess(true);
      if (errorMsg) {
        setSuccessMessage(
          "Erreur lors de la création du collaborateur : " + errorMsg
        );
      } else {
        setSuccessMessage(successMsg);
      }
    }
  };

  const deleteCollaborator = async (id) => {
    const { error } = await supabase
      .from("collaborators")
      .delete()
      .eq("id", id);
    if (error) {
    } else {
      setCollaborators(collaborators.filter((c) => c.id !== id));
    }
  };

  // Ajout de la fonction refreshProjects avant le return
  const refreshProjects = async () => {
    if (isCollaborator && user?.email) {
      const { data: collabRecord } = await supabase
        .from("collaborators")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (collabRecord?.id) {
        const { data: access } = await supabase
          .from("collaborator_project_access")
          .select("project(*)")
          .eq("collaborator_id", collabRecord.id)
          .eq("can_edit", true);

        setProjects(access?.map((a) => a.project) || []);
      }
    } else if (user?.id) {
      const { data: updatedProjects, error } = await supabase
        .from("project")
        .select("*")
        .eq("user_id", user.id);
      if (!error) {
        setProjects(updatedProjects || []);
      }
    }
  };

  if (maxCollaborators === null) {
    return null;
  }

  return (
    <div className="flex h-screen w-full">
      <aside className="w-64 bg-gray-900 shadow-lg flex flex-col border-r border-gray-800 h-full">
        {/* User info */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold text-lg">
            {user?.email ? user.email[0].toUpperCase() : "?"}
          </div>
          <div>
            <div className="font-bold text-sm text-white truncate max-w-[120px]">{user ? user.email : t('guest')}</div>
            <div className="text-xs text-gray-400">{isPromoteur ? 'Promoteur' : isCollaborator ? 'Collaborateur' : 'Utilisateur'}</div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 p-2 overflow-y-auto">
          {/* Section Générale */}
          <div className="mb-2">
            <div className="text-xs font-semibold uppercase text-gray-400 px-2 mb-1 tracking-widest">{t('general')}</div>
            <button
              onClick={() => {
                setSelectedProject(null);
                setActiveView("overview");
              }}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all
                ${activeView === "overview" ? "bg-gray-800 border-l-4 border-blue-200 text-blue-200" : "hover:bg-gray-800 text-gray-200 hover:text-blue-200"}
              `}
              aria-label={t('overview')}
            >
              <FaBuilding className="text-xl" />
              <span className="text-sm font-medium flex-1 text-left">{t('overview')}</span>
              <span className="text-xs text-gray-400">{projects.length}</span>
            </button>
          </div>
          {/* Section Administration */}
          {(!isCollaborator || isPromoteur) && (
            <div className="mb-2">
              <div className="text-xs font-semibold uppercase text-gray-400 px-2 mb-1 tracking-widest">{t('admin')}</div>
              <button
                onClick={() => setActiveView("collaborators")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all
                  ${activeView === "collaborators" ? "bg-gray-800 border-l-4 border-blue-200 text-blue-200" : "hover:bg-gray-800 text-gray-200 hover:text-blue-200"}
                `}
                aria-label={t('projects_collaborators')}
              >
                <FaUsers className="text-xl" />
                <span className="text-sm font-medium flex-1 text-left">{t('projects_collaborators')}</span>
              </button>
              <button
                onClick={() => setActiveView("privileges")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all
                  ${activeView === "privileges" ? "bg-gray-800 border-l-4 border-blue-500 text-blue-200" : "hover:bg-gray-800 text-gray-200 hover:text-blue-200"}
                `}
                aria-label={t('privileges')}
              >
                <FaShieldAlt className="text-xl" />
                <span className="text-sm font-medium flex-1 text-left">{t('privileges')}</span>
              </button>
            </div>
          )}
          {/* Section Projets */}
          <div className="mb-2">
            <div className="text-xs font-semibold uppercase text-gray-400 px-2 mb-1 tracking-widest">{t('projects')}</div>
            <div className="flex flex-col gap-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setActiveView("appartements");
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all
                    ${selectedProject?.id === project.id && activeView === "appartements" ? "bg-gray-800 border-l-4 border-blue-200 text-blue-200" : "hover:bg-gray-800 text-gray-200 hover:text-blue-200"}
                  `}
                  aria-label={project.name}
                >
                  <FaBuilding
                    className={`text-xl ${project.online === true || project.online === "TRUE" ? "text-green-400" : "text-gray-500"}`}
                  />
                  <span className="text-sm font-medium flex-1 text-left truncate">{project.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>
      <div className="w-full flex flex-col overflow-hidden">
        {selectedProject && !activeView && (
          <FullDetail project={selectedProject} />
        )}

        {activeView === "collaborators" && !isCollaborator && maxCollaborators !== null && (
          <div className="p-6 overflow-y-auto">
            <div className="flex gap-6">
              <div className="w-1/2">
                <CollaboratorManager
                  collaborators={collaborators}
                  setCollaborators={setCollaborators}
                  maxCollaborators={maxCollaborators}
                  newEmail={newEmail}
                  setNewEmail={setNewEmail}
                  newFirstName={newFirstName}
                  setNewFirstName={setNewFirstName}
                  newLastName={newLastName}
                  setNewLastName={setNewLastName}
                  addCollaborator={addCollaborator}
                  deleteCollaborator={deleteCollaborator}
                  t={t}
                />
              </div>
              <div className="w-1/2">
                <ProjectForm
                  user={user}
                  onProjectAdded={(newProject) =>
                    setProjects([newProject, ...projects])
                  }
                  t={t}
                />
              </div>
            </div>
          </div>
        )}

        {activeView === "privileges" && !isCollaborator && (
          <div className="flex-1 p-6 border-t overflow-auto">
            <PermissionMatrix
              user={user}
              collaborators={collaborators}
              projects={projects}
              t={t}
            />
          </div>
        )}

        {selectedProject && activeView === "appartements" && (
          <div className="flex-1 p-6 overflow-auto">
            <Projectb
              key={selectedProject.id}
              project={selectedProject}
              user={user}
              onProjectUpdate={(updatedProject) => {
                setSelectedProject(updatedProject);
                refreshProjects();
              }}
            />
          </div>
        )}

        {activeView === "overview" && !isCollaborator && (
          <Generale projects={projects} />
        )}
      </div>
    </div>
  );
}
