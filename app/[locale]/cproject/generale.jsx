'use client';
import { FaBuilding, FaUsers } from 'react-icons/fa';
import { MdApartment, MdOnlinePrediction } from 'react-icons/md';
import { useTranslations } from "next-intl";

export default function Generale({ projects }) {
  const t = useTranslations("Navbar");

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
        {t('overview_projects')}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label={t('projects')} value={projects.length} />
        <StatCard label={t('online')} value={projects.filter(p => p.online).length} />
        <StatCard label={t('collaborators')} value={projects.reduce((sum, p) => sum + (p.editorCount || 0), 0)} />
        <StatCard label={t('apartments')} value={projects.reduce((sum, p) => sum + (p.apart_count || 0), 0)} />
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
                {project.online ? t('online') : t('offline')}
              </span>
            </p>
            <p className="mb-1">
              <FaUsers className="inline-block mr-2 text-gray-500" />
              {project.editorCount || 0} {t('collaborators')}
            </p>
            <p className="mb-3">
              <MdApartment className="inline-block mr-2 text-gray-500" />
              {project.apart_count || 0} {t('apartments')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}