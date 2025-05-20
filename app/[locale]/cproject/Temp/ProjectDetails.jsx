"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ProjectDetails({ project }) {
  if (!project) return null;

  return (
    <Card className="shadow-md border border-gray-200 mb-6">
      <CardContent className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Projet sélectionné</h2>
        <div>
          <span className="font-medium">Nom :</span> {project.name}
        </div>
        <div>
          <span className="font-medium">Compagnie :</span>{" "}
          {project.compagny || <span className="italic text-gray-500">Non spécifiée</span>}
        </div>
        {/* Tu pourras facilement ajouter ici : statut, adresse, nombre de logements, etc. */}
      </CardContent>
    </Card>
  );
}
