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

const amenitiesIcons = [Lift, Swim, Reception, Fitness, Cctv, Sauna, Disabled];

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
  const { country = "Non défini", city = "Non défini", name = "Non défini", adress = "Non défini", des = "Non défini" } = projectData || {};

  return (
    <div className="w-full mt-16 text-sm">
      {projectData ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4">
            {[i1, i2, i3, i4, i5].map((img, index) => (
              <div
                key={index}
                className={index === 0 ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2" : "col-span-1"}
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

          <div id="content-container" className="flex w-full px-4 md:px-10 mt-8">
            <div className="w-full sm:w-2/3 lg:w-2/3 p-6 flex flex-col gap-6">
              <p className="text-gray-500 text-sm sm:text-lg">
                <span className="text-blue-500">{country}</span> /
                <span className="text-blue-500 px-1">{city}</span> /
                <span className="pl-1">{name}</span>
              </p>
              <h2 className="font-bold text-4xl sm:text-5xl mt-4 mb-2 text-gray-800">{name}</h2>
              <p className="text-gray-600 text-base mb-6">
                <span>{adress}</span>, <span>{city}</span>, <span>{country}</span>
              </p>

              <h3 className="font-semibold text-xl sm:text-2xl text-gray-700 mt-2 mb-4">
                Presidential Towers
              </h3>
              <p className="text-gray-600 whitespace-pre-line">{des}</p>

              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-700">Community Amenities</h2>
              <p className="text-gray-600 whitespace-pre-line">{des}</p>
              <div className="flex flex-wrap gap-6 mt-4">
                {amenitiesIcons.map((Icon, i) => (
                  <div key={i} className="w-18 sm:w-20 md:w-24">
                    <Icon className="transform transition-transform duration-300 hover:scale-110" />
                  </div>
                ))}
              </div>

              <h2 className="font-semibold text-lg sm:text-xl mb-4 text-gray-700">Location</h2>
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
                      <td className="border p-3 text-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" class="mx-auto text-green-500" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M208,44a91.55,91.55,0,0,0-33.77,6.42c-15.8-24.4-39.72-36.58-40.86-37.15a12,12,0,0,0-10.74,0c-1.14.57-25.06,12.75-40.86,37.15A91.55,91.55,0,0,0,48,44,12,12,0,0,0,36,56V96a92.14,92.14,0,0,0,80,91.22v25.36L85.37,197.27a12,12,0,0,0-10.74,21.46l48,24a12,12,0,0,0,10.74,0l48-24a12,12,0,1,0-10.74-21.46L140,212.58V187.22A92.14,92.14,0,0,0,220,96V56A12,12,0,0,0,208,44Zm-80-6.06c6.37,4.16,17.13,12.31,25.21,24.2A92.63,92.63,0,0,0,128,90.61a92.76,92.76,0,0,0-25.21-28.47C110.87,50.25,121.63,42.1,128,37.94ZM60,96V69.06A68.11,68.11,0,0,1,116,136v26.94A68.12,68.12,0,0,1,60,96Zm136,0a68.12,68.12,0,0,1-56,66.94V136a68.11,68.11,0,0,1,56-66.94Z"></path></svg></td>
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

  <button className="bg-[#755808] text-white px-6 py-3 w-full rounded-lg text-lg shadow-md transition-colors duration-300 hover:bg-[#6c4a07] transform active:scale-95">
    Go to Property Developer
  </button>

  <p className="mt-6 text-gray-500 text-sm">
    Language: <span className="font-semibold">English</span>
  </p>
</div>

                <PageM />
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
