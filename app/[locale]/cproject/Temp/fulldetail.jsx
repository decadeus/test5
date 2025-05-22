import ProjectEditableFields from "./ProjectDetails";
import ProjectFacilities from "./ProjectFacilities"; // nouveau

export default function FullDetail({ project }) {
  if (!project) return null;

  return (
    <div className="w-full flex">
      <div className="w-1/2">
        <ProjectEditableFields project={project} />
      </div>
      <div className="w-1/2">
        <ProjectFacilities project={project} />
      </div>
    </div>
  );
}
