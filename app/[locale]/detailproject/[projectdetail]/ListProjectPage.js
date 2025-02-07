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
import PageM from "@/components/nmap.jsx";
import Flower from "@/components/svg/flower.js";
import Bike from "@/components/svg/bike.js";



export default function ListProjectPage() {
  const { projectdetail } = useParams();
  const supabase = createClient();
  const [projectData, setProjectData] = useState(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    if (!projectdetail) return;

    const fetchValue = async () => {
      const { data, error } = await supabase
        .from("project")
        .select()
        .eq("codepro", projectdetail)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
      } else {
        setProjectData(data);
      }
    };

    fetchValue();
  }, [projectdetail, supabase]);

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
    country = "Non défini",
    city = "Non défini",
    name = "Non défini",
    adress = "Non défini",
    des = "Non défini",
    metades = "Non défini",
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

  return (
    <div className="w-full mt-16 text-sm">
      {projectData ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4">
            {[i1, i2, i3, i4, i5].map((img, index) => (
              <div
                key={index}
                className={
                  index === 0
                    ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2"
                    : "col-span-1"
                }
              >
                <Image
                  src={img}
                  layout="responsive"
                  width={16}
                  height={9}
                  alt="Project Image"
                  className="object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div
            id="content-container"
            className="flex w-full px-4 md:px-10 mt-8"
          >
            <div className="w-full sm:w-2/3 lg:w-2/3 p-6 flex flex-col gap-4">
              <p className="text-gray-500 text-sm sm:text-lg">
                <span className="text-blue-500">{country}</span> /
                <span className="text-blue-500 px-1">{city}</span> /
                <span className="pl-1">{name}</span>
              </p>
              <h1 className="font-bold text-4xl sm:text-5xl mt-4 mb-2 text-gray-800">
                {name}
              </h1>
              <p className="text-gray-600 text-base mb-6">
                <span>{adress}</span>, <span>{city}</span>,{" "}
                <span>{country}</span>
              </p>

              <h2 className="font-semibold text-lg sm:text-xl mb-0 text-gray-700">
                {metades}
              </h2>
              <p className="text-gray-600 whitespace-pre-line">{des}</p>

              <h2 className="font-semibold text-lg sm:text-xl mb-0 text-gray-700">
                Community Amenities
              </h2>
              <p className="text-gray-600 whitespace-pre-line">{des}</p>
              <div className="flex flex-wrap gap-6 mt-4">
                {amenitiesIcons.map((Icon, i) => (
                  <div key={i} className="w-18 sm:w-20 md:w-24">
                    <Icon className="transform transition-transform duration-300 hover:scale-110" />
                  </div>
                ))}
              </div>

              <h2 className="font-semibold text-lg sm:text-xl mb-1 text-gray-700">
                Location
              </h2>
              <p className="text-gray-600">{des}</p>

              <table className="table-auto w-full border border-gray-300 text-gray-700 text-xs sm:text-sm mt-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3">Ref</th>
                    <th className="border p-3">Bedrooms</th>
                    <th className="border p-3">Surface</th>
                    <th className="border p-3">Floor</th>
                    <th className="border p-3">Price</th>
                    <th className="border p-3">Garden</th>
                  </tr>
                </thead>
                <tbody>
                  {["E4501", "E4502", "E4503"].map((ref, i) => (
                    <tr key={i} className="odd:bg-gray-50 hover:bg-gray-200">
                      <td className="border p-3">{ref}</td>
                      <td className="border p-3 text-center">3</td>
                      <td className="border p-3">85 m²</td>
                      <td className="border p-3 text-center">3</td>
                      <td className="border p-3 font-semibold">250,000 PLN</td>
                      <td className="border p-3 text-center w-20 h-20">
                        <Flower className="w-24 h-24" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full sm:w-1/3 lg:w-1/3 pl-4 sm:pl-16 pt-16">
              <div
                id="sidebar"
                className={
                  isFixed
                    ? "fixed top-20 w-full sm:w-96"
                    : "sticky top-20 w-full sm:w-96"
                }
              >
                <div className="border text-gray-700 bg-white shadow-xl rounded-lg w-full p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
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
                   <PageM lat={projectData.lat} lng={projectData.lng} />
                </div>

              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 mt-4">Chargement des données...</p>
      )}
    </div>
  );
}
