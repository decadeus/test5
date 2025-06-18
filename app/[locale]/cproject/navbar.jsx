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

export default function Layout() {
  const supabase = createClientComponentClient();

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
  const maxCollaborators = 5;

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
          // Ajout récupération des accès et enrichissement avec editorCount
          const { data: accessList } = await supabase
            .from("collaborator_project_access")
            .select("project_id,can_edit");
          if (!accessList) {
          }

          const projectsWithEditors = (projs || []).map((p) => {
            const editors = accessList?.filter(
              (a) => a.project_id === p.id && a.can_edit
            );
            return { ...p, editorCount: editors?.length ?? 0 };
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

  return (
    <div className="flex h-screen w-full">
      <div className="w-fit bg-gray-800 text-white p-4 flex flex-col h-full">
        <h2 className="text-sm font-bold mb-4">
          Bienvenue, {user ? user.email : "Invité"}
        </h2>

        {showSuccess && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-2">
            {successMessage}
          </div>
        )}

        <ul className="flex-grow">
          <li className="mb-4">
            <h3 className="text-xs font-semibold uppercase mb-2">Générale</h3>
            <ul>
              <li className="mb-2 flex items-center">
                <FaBuilding className="mr-2" />
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setActiveView("overview");
                  }}
                  className="text-left w-full"
                >
                  Vue d'ensemble
                  <div className="text-xs text-gray-200 mt-1">
                    {projects.length} projets
                  </div>
                </button>
              </li>
            </ul>
          </li>

          {(!isCollaborator || isPromoteur) && (
            <li className="mb-4">
              <h3 className="text-xs font-semibold uppercase mb-2">
                Administration
              </h3>
              <ul>
                <li className="mb-2 flex items-center">
                  <FaCreditCard className="mr-2" />
                  <a href="#" className="text-gray-200 hover:text-white">
                    Abonnement
                  </a>
                </li>
                <li className="mb-2 flex items-center">
                  <FaUsers className="mr-2" />
                  <button
                    onClick={() => setActiveView("collaborators")}
                    className="text-left w-full"
                  >
                    Projets / Collaborateurs
                  </button>
                </li>
                <li className="mb-2 flex items-center">
                  <FaShieldAlt className="mr-2" />
                  <button
                    onClick={() => setActiveView("privileges")}
                    className="text-left w-full"
                  >
                    Privilèges
                  </button>
                </li>
              </ul>
            </li>
          )}

          {projects.map((project) => (
            <li key={project.id} className="mb-2">
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setActiveView("appartements");
                }}
                className="flex items-center hover:text-white text-left w-full"
              >
                <FaBuilding
                  className={`mr-2 text-xl ${
                    project.online === true || project.online === "TRUE"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                />
                <span className="text-gray-200">{project.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full flex flex-col overflow-hidden">
        {selectedProject && !activeView && (
          <FullDetail project={selectedProject} />
        )}

        {activeView === "collaborators" && !isCollaborator && (
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
                />
              </div>
              <div className="w-1/2">
                <ProjectForm
                  user={user}
                  onProjectAdded={(newProject) =>
                    setProjects([newProject, ...projects])
                  }
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
