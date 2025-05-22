"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

export default function ProjectEditableFields({ project }) {
  const supabase = createClient();

// ❌ NE PLUS inclure "name"
const [form, setForm] = useState({
  compagny: "",
  city: "",
  cur: "",
  lat: "",
  lng: "",
  link: "",
  online: ""
});

const [current, setCurrent] = useState({
  compagny: project.compagny || "",
  city: project.city || "",
  cur: project.cur || "PLN",
  lat: project.lat || "",
  lng: project.lng || "",
  link: project.link || "",
  online: project.online || false
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  setCurrent({
    compagny: project.compagny || "",
    city: project.city || "",
    cur: project.cur || "PLN",
    lat: project.lat || "",
    lng: project.lng || "",
    link: project.link || "",
    online: project.online || false
  });
}, [project]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setError(null);

    const updates = {};
    for (const field in form) {
      const input = form[field];
      const base = current[field];

      const hasChanged =
        field === "lat" || field === "lng"
          ? input !== "" && parseFloat(input) !== parseFloat(base)
          : input !== "" && input !== base;

      if (hasChanged) {
        updates[field] = field === "lat" || field === "lng" ? parseFloat(input) : input;
      }
    }

    if (Object.keys(updates).length === 0) {
      setError("Aucune modification à enregistrer.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("project")
      .update(updates)
      .eq("id", project.id);

    if (updateError) {
      console.error(updateError);
      setError("Erreur lors de la sauvegarde : " + updateError.message);
    } else {
      setCurrent((prev) => ({ ...prev, ...updates }));
      setForm({
        name: "",
        compagny: "",
        city: "",
        cur: "",
        lat: "",
        lng: "",
        link: ""
      });
    }

    setLoading(false);
  };

  const hasChanges = Object.entries(form).some(([field, value]) => {
    const currentValue = current[field];
    if (field === "lat" || field === "lng") {
      return value !== "" && parseFloat(value) !== parseFloat(currentValue);
    }
    return value !== "" && value !== currentValue;
  });

  if (!project) return null;

  return (
    <Card className="shadow-md border border-gray-200 mb-6">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">{project.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            
            { label: "Compagnie", field: "compagny", type: "text" },
            { label: "Ville", field: "city", type: "text" },
            { label: "Latitude", field: "lat", type: "number" },
            { label: "Longitude", field: "lng", type: "number" },
            { label: "Lien", field: "link", type: "text" }
          ].map(({ label, field, type }) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                value={form[field]}
                placeholder={current[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                disabled={loading}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Devise</label>
            <select
              value={form.cur}
              onChange={(e) => handleChange("cur", e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              disabled={loading}
            >
              <option value="">-- Modifier la devise --</option>
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
            </select>
            <span className="text-xs text-gray-500 mt-1">Actuelle : {current.cur}</span>
          </div>
          <div className="flex items-center space-x-2 pt-4">
  <label className="text-sm font-medium">Statut en ligne :</label>
  <input
    type="checkbox"
    checked={form.online === "" ? current.online : form.online}
    onChange={(e) => handleChange("online", e.target.checked)}
    className="h-4 w-4"
    disabled={loading}
  />
  <span
    className={`text-sm font-semibold ${
      (form.online === "" ? current.online : form.online)
        ? "text-green-600"
        : "text-red-500"
    }`}
  >
    {form.online === "" ? (current.online ? "Actif" : "Inactif") : (form.online ? "Actif" : "Inactif")}
  </span>
</div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-4">
          <button
            onClick={handleSaveAll}
            disabled={loading || !hasChanges}
            className={`w-full md:w-auto px-6 py-2 rounded text-sm ${
              loading || !hasChanges
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}