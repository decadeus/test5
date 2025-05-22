"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaCreditCard, FaUsers, FaShieldAlt } from "react-icons/fa";
import CollaboratorManager from "./ProjetManagement";
import ProjectForm from "./ProjectForm";
import PermissionMatrix from "./PermissionMatrix";
import FullDetail from "./fulldetail"; // adapte le chemin si besoin
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Layout() {
  const supabase = createClientComponentClient();

  const [activeView, setActiveView] = useState("collaborators");
  const [selectedProject, setSelectedProject] = useState(null);

  const [user, setUser] = useState(null);
  const [isCollaborator, setIsCollaborator] = useState(false);
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

      // Vérifie si l'utilisateur est un collaborateur
      const { data: collabRecord } = await supabase
        .from("collaborators")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      const isCollab = !!collabRecord;

      setIsCollaborator(isCollab);

      if (isCollab && collabRecord?.id) {
        // Collaborateur
        setCollaborators([]);

        const { data: access } = await supabase
          .from("collaborator_project_access")
          .select("project(*)")
          .eq("collaborator_id", collabRecord.id);

        setProjects(access?.map((a) => a.project) || []);
      } else {
        // Promoteur
        const { data: projs, error: projError } = await supabase
          .from("project")
          .select("*")
          .eq("user_id", user.id);

        if (projError) {
          console.error("Erreur projets", projError);
        } else {
          setProjects(projs || []);
        }

        const { data: collabs, error: collabError } = await supabase
          .from("collaborators")
          .select("*")
          .eq("promoter_id", user.id);

        if (collabError) {
          console.error("Erreur collaborateurs", collabError);
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
      const { data, error } = await supabase
        .from("collaborators")
        .insert([
          {
            promoter_id: user.id,
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
    const { error } = await supabase.from("collaborators").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression", error);
    } else {
      setCollaborators(collaborators.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Navbar
        user={user}
        projects={projects}
        setActiveView={setActiveView}
        setSelectedProject={setSelectedProject}
        isCollaborator={isCollaborator}
      />

      <div className="w-full flex flex-col overflow-hidden">
       {selectedProject && !activeView && <FullDetail project={selectedProject} />}

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
      </div>
    </div>
  );
}



function Navbar({ setActiveView, user, projects, setSelectedProject, isCollaborator }) {
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
     
      <ul className="flex-grow">
        {!isCollaborator && (
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
                    Projet/Collaborateur
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
        )}
<hr />
        {projects.map((project) => (
          <li key={project.id} className="mb-2">
            <button
              onClick={() => {
                setSelectedProject(project);
                setActiveView(null);
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
