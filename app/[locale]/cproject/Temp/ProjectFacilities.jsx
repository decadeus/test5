"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const facilitiesList = [
  { label: "Vidéo surveillance", field: "cctv" },
  { label: "Piscine", field: "swim" },
  { label: "Entrée sécurisée", field: "entrance" },
  { label: "Local vélo", field: "bike" },
  { label: "Accès PMR", field: "disabled" },
  { label: "Salle de sport", field: "fitness" },
  { label: "Sauna", field: "sauna" },
  { label: "Ascenseur", field: "lift" }
];

export default function ProjectFacilities({ project }) {
  const supabase = createClient();
  const [current, setCurrent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = {};
    facilitiesList.forEach(({ field }) => {
      init[field] = project[field] || false;
    });
    setCurrent(init);
  }, [project]);

  const toggleFacility = async (field) => {
    const newValue = !current[field];
    setLoading(true);

    const { error } = await supabase
      .from("project")
      .update({ [field]: newValue })
      .eq("id", project.id);

    if (error) {
      console.error("Erreur mise à jour Supabase :", error);
    } else {
      setCurrent((prev) => ({ ...prev, [field]: newValue }));
    }

    setLoading(false);
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-white mt-6">
      <h3 className="text-lg font-semibold mb-4">Équipements disponibles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {facilitiesList.map(({ label, field }) => (
          <label key={field} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={current[field] || false}
              onChange={() => toggleFacility(field)}
              disabled={loading}
              className="accent-blue-600"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}