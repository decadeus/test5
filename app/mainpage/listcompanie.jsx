"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { companies } from "@/utils/companies";
import Image from "next/image";

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
    <div className="w-full xl:px-4 md:px-8">
      {/* Grille responsive avec toujours 2 colonnes */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="border rounded shadow text-center group transition duration-300 ease-in-out hover:bg-white hover:text-black h-[200px] sm:h-[240px] lg:h-[260px] xl:h-[280px] hover:border-black hover:border-2 hover:rounded"
          >
            <div className="flex flex-col justify-center items-center h-full w-full relative">
              {/* Image de l'entreprise */}
              <div className="group-hover:hidden w-full h-full relative">
                <Image
                  src={`/companies/${company.pic}`}
                  alt={company.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {/* Détails lors du survol */}
              <div className="hidden group-hover:flex flex-col items-center justify-center absolute inset-0 bg-opacity-80 bg-white text-black">
                <p className="text-lg sm:text-xl lg:text-2xl">{company.name}</p>
                <div className="flex flex-col gap-2 sm:gap-4 mt-4 lg:mt-8 ">
                  <div className="flex flex-col items-center xl:pl-2 sm:pl-4 xl:border-r-2 xl:pr-2 sm:pr-4">
                    <p className="font-bold text-sm sm:text-base lg:text-lg">
                      {countProjectsForCompany(company.name)}
                    </p>
                    <p className="text-xs sm:text-sm">Projects</p>
                  </div>
                  <div className="flex flex-col items-center xl:pl-2 sm:pl-4 xl:border-r-2 xl:pr-2 sm:pr-4">
                    <p className="font-bold text-sm sm:text-base lg:text-lg">
                      {countDistinctCitiesForCompany(company.name)}
                    </p>
                    <p className="text-xs sm:text-sm">Cities</p>
                  </div>
                  <div className="flex flex-col items-center xl:pl-2 sm:pl-4 xl:border-r-2 xl:pr-2 sm:pr-4">
                    <p className="font-bold text-sm sm:text-base lg:text-lg">
                      {countProjectlistRowsForCompany(company.name)}
                    </p>
                    <p className="text-xs sm:text-sm">Apartments</p>
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
