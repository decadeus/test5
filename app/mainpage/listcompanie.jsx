"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { companies } from "@/utils/companies"; // Importation des entreprises
import Image from "next/image"; // Importer l'élément Image de Next.js

export default function ListCompanies() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project")
        .select("*, projectlist(*)");

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const countProjectsForCompany = (companyName) => {
    return projects.filter((project) => project.compagny === companyName)
      .length;
  };

  const countProjectlistRowsForCompany = (companyName) => {
    const companyProjects = projects.filter(
      (project) => project.compagny === companyName
    );
    const totalCount = companyProjects.reduce((count, project) => {
      return count + project.projectlist.length;
    }, 0);
    return totalCount;
  };

  const countDistinctCitiesForCompany = (companyName) => {
    const cities = projects
      .filter((project) => project.compagny === companyName)
      .map((project) => project.city);
    const uniqueCities = new Set(cities);
    return uniqueCities.size;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="border rounded shadow text-center textfull group transition duration-300 ease-in-out hover:bg-white hover:text-black h-[220px] hover:border-black hover:border-2 hover:h-[220px] hover:rounded"
          >
            <div className="flex flex-col justify-center items-center h-full w-full relative">
              {/* Afficher l'image de l'entreprise en tant que cover */}
              <div className="group-hover:hidden w-full h-full relative">
                <Image
                  src={`/companies/${company.pic}`} // Utilise le chemin relatif depuis /public
                  alt={company.name}
                  fill
                  className="object-cover rounded" // Utilisation de fill et object-cover pour la couverture complète
                />
              </div>
              {/* Afficher les détails lors du survol */}
              <div className="hidden group-hover:flex flex-col items-center justify-center absolute inset-0 bg-opacity-80 bg-white text-black">
                <p className="text-xl">{company.name}</p>
                <div className="flex gap-4 mt-8">
                  <div className="flex flex-col items-center border-r-2 pr-4">
                    <p className="font-bold">
                      {countProjectsForCompany(company.name)}
                    </p>
                    <p>Projects</p>
                  </div>
                  <div className="flex flex-col items-center pl-4 border-r-2 pr-4">
                    <p className="font-bold">
                      {countDistinctCitiesForCompany(company.name)}
                    </p>
                    <p>Cities</p>
                  </div>
                  <div className="flex flex-col items-center pl-4">
                    <p className="font-bold">
                      {countProjectlistRowsForCompany(company.name)}
                    </p>
                    <p>Apartements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
