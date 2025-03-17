"use client";

import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import i1 from "@/components/image/appart1.jpg";
import i2 from "@/components/image/appart2.jpg";
import i3 from "@/components/image/appart3.jpg";
import i4 from "@/components/image/beach.jpg";
import i5 from "@/components/image/beach2.jpg";
import Lift from "@/components/svg/lift.js";
import Swim from "@/components/svg/swim.js";
import Reception from "@/components/svg/reception.js";
import Fitness from "@/components/svg/fitness.js";
import Cctv from "@/components/svg/cctv.js";
import Sauna from "@/components/svg/sauna.js";
import Disabled from "@/components/svg/disabled.js";

import Flower from "@/components/svg/flower.js";
import Bike from "@/components/svg/bike.js";
import PageM from "@/components/nmap.jsx";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Avatar from "@/app/getimage/project";
import Link from "next/link";
import Loading from "@/app/[locale]/loading";

export default function ListProjectPage() {
  const { projectdetail } = useParams();
  const supabase = createClient();
  const [projectData, setProjectData] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  useEffect(() => {
    if (!projectdetail) return;

    const fetchValue = async () => {
      try {
        const { data, error } = await supabase
          .from("project")
          .select("*, projectlist(*)")
          .eq("codepro", projectdetail)
          .single();

        if (error) throw error;

        setProjectData(data);
        setSortedData(data.projectlist || []);

        // Récupérer les projets associés
        if (data) {
          const { data: relatedData, error: relatedError } = await supabase
            .from("project")
            .select("name, codepro, compagny, mainpic_url")
            .eq("compagny", data.compagny)
            .neq("codepro", data.codepro);

          if (relatedError) throw relatedError;
          setRelatedProjects(relatedData || []);
        }
      } catch (error) {
        console.error("Error fetching project:", error.message);
      }
    };

    fetchValue();
  }, [projectdetail]);

  useEffect(() => {
    const storedCountry = localStorage.getItem("selectedCountry");
    const storedCity = localStorage.getItem("selectedCity");

    if (storedCountry) setCountry(storedCountry);
    if (storedCity) setCity(storedCity);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.getElementById("sidebar");
      const container = document.getElementById("content-container");

      if (!sidebar || !container) return;

      const containerRect = container.getBoundingClientRect();
      setIsFixed(containerRect.top <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Récupération des informations du projet avec des valeurs par défaut
  const {
    country: projectCountry,
    city: projectCity,
    name = "Non défini",
    adress = "Non défini",
    des = "Non défini",
    metades = "Non défini",
    compagny = "Non défini",
    en = false,
    fr = false,
    ru = false,
    po = false,
    ge = false,
    lift = false,
    swim = false,
    cctv = false,
    fitness = false,
    sauna = false,
    disabled = false,
    entrance = false,
    bike = false,
  } = projectData || {};

  // Use project data if available; otherwise, use local storage values
  const displayCountry = projectCountry || country || "Non défini";
  const displayCity = projectCity || city || "Non défini";
  const amenitiesIcons = [
    lift && Lift,
    swim && Swim,
    cctv && Cctv,
    fitness && Fitness,
    sauna && Sauna,
    disabled && Disabled,
    entrance && Reception,
    bike && Bike,
  ].filter(Boolean);

  const languages = [
    en && "English",
    fr && "Français",
    ru && "Русский",
    po && "Po Polsku",
    ge && "Deutsch",
  ].filter(Boolean);

  // Fonction de tri
  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);

    const sorted = [...sortedData].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return order === "asc"
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      }
    });

    setSortedData(sorted);
  };

  // Icône de tri
  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };



useEffect(() => {
  const storedLanguage = localStorage.getItem("selectedLanguage") || "en";
  setSelectedLanguage(storedLanguage);
}, []);

  return (
    <div className="w-full mt-16 text-sm">
      {projectData ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-2">
            {[
              projectData?.mainpic_url,
              projectData?.pic2,
              projectData?.pic3,
              projectData?.pic4,
              projectData?.pic5,
            ].map((img, index) => (
              <div
                key={index}
                className={`relative ${
                  index === 0
                    ? "col-span-2 sm:col-span-2 lg:col-span-2 row-span-2"
                    : "col-span-1"
                } 
      ${
        index === 0
          ? "h-[200px] lg:h-[500px] md:h-[200px] sm:h-[100px]"
          : "h-[94px] lg:h-[245px] md:h-[120px] sm:h-[80px]"
      }
      `}
              >
                {img ? (
                  <Avatar
                    url={img}
                    alt={`Project Image ${index + 1}`}
                    className={`w-full object-cover rounded-xl transition-transform duration-300 hover:scale-105 h-full`}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600 rounded-xl">
                    Image non disponible
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            id="content-container"
            className=" w-full flex-col px-4 md:px-10 mt-8 lg:flex-row flex"
          >
            <div className="w-full lg:w-2/3 pl-2 pr-2 flex flex-col gap-12">
              <div>
                <p className="text-gray-500 text-sm sm:text-lg">
                  <Link
                    href="/en/projects"
                    onClick={() =>
                      localStorage.setItem("selectedCity", "Select city")
                    }
                  >
                    <span className="text-blue-500 hover:underline cursor-pointer">
                      {displayCountry}
                    </span>
                  </Link>
                  /
                 
                  <Link href={`/${selectedLanguage || "en"}/projects`}>
  <span className="text-blue-500 px-1 hover:underline cursor-pointer">
    {displayCity}
  </span>
</Link>
                  /<span className="pl-1">{name}</span>
                </p>
              </div>
              {/* Name */}
              <div>
                <h1 className="font-bold text-4xl sm:text-5xl mt-4 mb-2 text-gray-800">
                  {name}
                </h1>

                <p className="text-gray-600 text-base ">
                  <span>{adress}</span>, <span>{city}</span>,{" "}
                  <span>{country}</span>
                </p>
              </div>

              {/* Metadatas */}
              <div className="">
                <h2 className="font-semibold text-lg sm:text-xl mb-2 text-gray-700">
                  {metades}
                </h2>
                <p className="text-gray-600 whitespace-pre-line">{des}</p>
              </div>

              {/* Community Amenities */}
              <div>
                <h2 className="font-semibold text-lg sm:text-xl mb-2 text-gray-700">
                  Community Amenities
                </h2>
                <p className="text-gray-600 whitespace-pre-line">{des}</p>
                <div className="flex flex-wrap gap-6 mt-4">
                  {amenitiesIcons.map((Icon, i) => (
                    <div key={i} className="w-24 sm:w-24 md:w-24">
                      <Icon className="transform transition-transform duration-300 hover:scale-110" />
                    </div>
                  ))}
                </div>
              </div>
              {/* List appartments */}
              <div>
                <h2 className="font-semibold text-lg sm:text-xl mb-2 text-gray-700">
                  Appartments on sell
                </h2>
                <p className="text-gray-600">{des}</p>

                <div className="overflow-x-auto">
                  <table className="table-auto w-full border border-gray-300 text-gray-700 text-xs sm:text-sm mt-6">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          className="border p-3 cursor-pointer"
                          onClick={() => handleSort("ref")}
                        >
                          <div className="flex justify-between items-center">
                            <span>Ref</span> <span>{getSortIcon("ref")}</span>
                          </div>
                        </th>
                        <th
                          className="border p-3 cursor-pointer"
                          onClick={() => handleSort("bed")}
                        >
                          <div className="flex justify-between items-center">
                            <span>Bedrooms</span>{" "}
                            <span>{getSortIcon("bed")}</span>
                          </div>
                        </th>
                        <th
                          className="border p-3 cursor-pointer"
                          onClick={() => handleSort("surface")}
                        >
                          <div className="flex justify-between items-center">
                            <span>Surface</span>{" "}
                            <span>{getSortIcon("surface")}</span>
                          </div>
                        </th>
                        <th
                          className="border p-3 cursor-pointer"
                          onClick={() => handleSort("floor")}
                        >
                          <div className="flex justify-between items-center">
                            <span>Floor</span>{" "}
                            <span>{getSortIcon("floor")}</span>
                          </div>
                        </th>
                        <th
                          className="border p-3 cursor-pointer"
                          onClick={() => handleSort("price")}
                        >
                          <div className="flex justify-between items-center">
                            <span>Price</span>{" "}
                            <span>{getSortIcon("price")}</span>
                          </div>
                        </th>
                        <th className="border p-3 text-center">Garden</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedData.map((item, i) => (
                        <tr
                          key={i}
                          className="odd:bg-gray-50 hover:bg-gray-200"
                        >
                          <td className="border p-3">{item.ref}</td>
                          <td className="border p-3 text-center">{item.bed}</td>
                          <td className="border p-3">{item.surface} m²</td>
                          <td className="border p-3 text-center">
                            {item.floor}
                          </td>
                          <td className="border p-3 font-semibold">
                            zł {item.price}
                          </td>
                          <td className="border p-3 text-center">
                            {item.garden && (
                              <Flower className="w-6 h-6 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Other project compagny */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">
                  Other projects from {compagny}
                </h3>

                {relatedProjects && relatedProjects.length > 0 ? (
                  <div>
                    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {relatedProjects.map((project, i) => (
                        <li
                          key={project.codepro || i}
                          className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-center"
                        >
                          <h4 className="font-semibold text-md mb-2">
                            {project.name}
                          </h4>

                          {/* Conteneur de l'image avec effet de hover */}
                          <div className="relative w-full h-[150px] md:h-[150px] lg:h-[200px] rounded-xl overflow-hidden cursor-pointer group">
                            {project.mainpic_url ? (
                              <Avatar
                                url={project.mainpic_url}
                                width={400} // Largeur améliorée
                                height={400} // Hauteur améliorée
                                alt="Project Image"
                                className="rounded-xl w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-xl">
                                <span className="text-gray-500">No image</span>
                              </div>
                            )}

                            {/* Bouton qui apparaît au survol */}
                            <Link href={`/en/detailproject/${project.codepro}`}>
                              <button className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-base font-semibold rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                Details
                              </button>
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No related projects available.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full sm:w-full lg:w-1/3 px-4 sm:pl-2 pt-16">
              <div
                id="sidebar"
                className={`w-full top-20 
    lg:sticky lg:top-20 lg:w-96
  `}
              >
                <div className="flex flex-col md:flex-row  gap-4 lg:flex-col border text-gray-700 bg-white shadow-xl rounded-lg w-full p-8 mb-4">
                  <div className="w-full lg:w-full">
                    <h1 className="mb-6 font-semibold text-2xl sm:text-3xl text-gray-800">
                      More Information
                    </h1>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      Learn more about the property details and features.
                    </p>
                    {projectData.link && (
                      <a
                        href={projectData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="bg-[#755808] text-white px-6 py-3 w-full rounded-lg text-lg shadow-md transition-colors duration-300 hover:bg-[#6c4a07] transform active:scale-95">
                          Go to Property Developer
                        </button>
                      </a>
                    )}

                    {languages.length > 0 && (
                      <p className="mt-6 text-gray-500 text-sm">
                        Language:{" "}
                        <span className="font-semibold">
                          {languages.join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="w-full lg:w-full">
                    <PageM lat={projectData.lat} lng={projectData.lng} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
