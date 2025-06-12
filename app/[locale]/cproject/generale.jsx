'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FaBuilding, FaUsers } from 'react-icons/fa';
import { MdApartment } from 'react-icons/md';
import { MdOnlinePrediction } from 'react-icons/md';

export default function Generale() {
  const supabase = createClient();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erreur utilisateur", userError);
        return;
      }

      const { data, error } = await supabase
        .from('project_edit_count')
        .select('id, name, online, edit_count, apart_count')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur de chargement des projets :', error);
      } else {
        setProjects(data);
      }
    }

    fetchProjects();
  }, [supabase]);

  function StatCard({ label, value }) {
    return (
      <div className="bg-white shadow rounded p-4 text-center">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500 uppercase mt-1">{label}</div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-700 mb-4">
        Vue d'ensemble des projets
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Projets" value={projects.length} />
        <StatCard label="En ligne" value={projects.filter(p => p.online).length} />
        <StatCard label="Collaborateurs" value={projects.reduce((sum, p) => sum + p.edit_count, 0)} />
        <StatCard label="Appartements" value={projects.reduce((sum, p) => sum + p.apart_count, 0)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaBuilding className="text-gray-500" /> {project.name}
            </h3>
            <p className="mb-1">
              <MdOnlinePrediction className="inline-block mr-2 text-gray-500" />
              <span className={project.online ? "text-green-600 font-semibold" : "text-gray-500"}>
                {project.online ? "En ligne" : "Hors ligne"}
              </span>
            </p>
            <p className="mb-1">
              <FaUsers className="inline-block mr-2 text-gray-500" />
              {project.edit_count} collaborateurs
            </p>
            <p className="mb-3">
              <MdApartment className="inline-block mr-2 text-gray-500" />
              {project.apart_count} appartements
            </p>
            <div className="bg-gray-100 h-32 rounded flex items-center justify-center text-gray-400 text-sm">
              [Graphique projet #{project.id}]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}