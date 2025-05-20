"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaCreditCard, FaUsers, FaShieldAlt } from "react-icons/fa";
import CollaboratorManager from "./ProjetManagement";
import ProjectForm from "./ProjectForm";
import PermissionMatrix from "./PermissionMatrix";
import ProjectDetails from "./ProjectDetails";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Layout() {
  const supabase = createClientComponentClient();

  const [activeView, setActiveView] = useState("collaborators");
  const [selectedProject, setSelectedProject] = useState(null);

  const [user, setUser] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [projects, setProjects] = useState([]);

  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const maxCollaborators = 5;

  useEffect(() => {
    const fetchAll = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Erreur utilisateur", userError);
        return;
      }

      setUser(user);

      const [
        { data: collabs, error: collabError },
        { data: projs, error: projError },
      ] = await Promise.all([
        supabase.from("collaborators").select("*").eq("user_id", user.id),
        supabase
          .from("project")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (collabError) console.error("Erreur collaborateurs", collabError);
      else setCollaborators(collabs);

      if (projError) console.error("Erreur projets", projError);
      else setProjects(projs);
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
      } else {
        setCollaborators([...collaborators, data[0]]);
        setNewEmail("");
        setNewFirstName("");
        setNewLastName("");
      }
    }
  };

  const deleteCollaborator = async (id) => {
    const { error } = await supabase
      .from("collaborators")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Erreur suppression", error);
    } else {
      setCollaborators(collaborators.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex h-screen">
      <Navbar
        user={user}
        projects={projects}
        setActiveView={setActiveView}
        setSelectedProject={setSelectedProject}
      />

      <div className="w-full flex flex-col overflow-hidden">
        {/* Projet sélectionné affiché en haut */}
      {selectedProject && <ProjectDetails project={selectedProject} />}


        {/* Haut : deux colonnes */}
        {activeView === "collaborators" && (
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

        {/* Bas : tableau de droits */}
        {activeView === "privileges" && (
          <div className="flex-1 p-6 border-t overflow-auto">
            <PermissionMatrix
              user={user}
              collaborators={collaborators}
              projects={projects}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Navbar({ setActiveView, user, projects, setSelectedProject }) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsAdminMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsAdminMenuOpen(false);
    }, 300);
  };

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.style.maxHeight = isAdminMenuOpen
        ? dropdownRef.current.scrollHeight + "px"
        : "0px";
    }
  }, [isAdminMenuOpen]);

  const preventDefault = (e) => e.preventDefault();

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col h-full">
      <h2 className="text-sm font-bold mb-4">
        Bienvenue, {user ? user.email : "Invité"}
      </h2>
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <ul className="flex-grow">
        <li
          className="mb-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <a
            href="#"
            onClick={preventDefault}
            className="text-gray-200 hover:text-white block p-2"
          >
            Administration
          </a>
          <div
            ref={dropdownRef}
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
              isAdminMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            style={{ maxHeight: "0px" }}
          >
            <ul className="bg-gray-700 text-white p-2 rounded shadow-lg">
              <li className="mb-2 flex items-center">
                <FaCreditCard className="mr-2" />
                <a
                  href="#"
                  onClick={preventDefault}
                  className="text-gray-200 hover:text-white block p-2"
                >
                  Abonnement
                </a>
              </li>
              <li className="mb-2 flex items-center">
                <FaUsers className="mr-2" />
                <button
                  onClick={() => setActiveView("collaborators")}
                  className="text-gray-200 hover:text-white block p-2 text-left w-full"
                >
                  Gestion Projet/Collaborateur
                </button>
              </li>
              <li className="mb-2 flex items-center">
                <FaShieldAlt className="mr-2" />
                <button
                  onClick={() => setActiveView("privileges")}
                  className="text-gray-200 hover:text-white block p-2 text-left w-full"
                >
                  Privilèges
                </button>
              </li>
            </ul>
          </div>
        </li>

        {/* Liste des projets */}
        {projects.map((project) => (
          <li key={project.id} className="mb-2">
            <button
              onClick={() => {
                setSelectedProject(project);
                setActiveView(null); // désactive les vues
              }}
              className="text-gray-200 hover:text-white block p-2 text-left w-full"
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
