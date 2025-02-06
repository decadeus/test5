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

      if (error) console.error("Error fetching project:", error);
      else setProjectData(data);
    };

    fetchValue();
  }, [projectdetail, supabase]);

  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.getElementById("sidebar");
      const container = document.getElementById("content-container");

      if (!sidebar || !container) return;

      const containerRect = container.getBoundingClientRect();
      setIsFixed(containerRect.top <= 0); // Fixed when the top of the container reaches the top of the viewport
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full mt-16 text-sm">
      {projectData ? (
        <>
          <div className="grid grid-cols-4 grid-rows-2 gap-2">
            {[i1, i2, i3, i4, i5].map((img, index) => (
              <div
                key={index}
                className={`col-span-${index === 0 ? "2 row-span-2" : "1"}`}
              >
                <Image
                  src={img}
                  layout="responsive"
                  width={16}
                  height={9}
                  alt="Project Image"
                  className="object-cover rounded-sm"
                />
              </div>
            ))}
          </div>

          <div id="content-container" className="flex w-full px-10">
            <div className="w-2/3 p-4 flex flex-col gap-4">
              <p className="flex gap-2">
                <span className="text-blue-500">{projectData.country}</span> /
                <span className="text-blue-500">{projectData.city}</span> /
                <span className="">{projectData.name}</span>
              </p>
              <h2 className="font-semibold text-4xl mt-4 mb-2">
                {projectData.name || "Non défini"}
              </h2>
              <p className="text-gray-700 text-normal">
                <span>{projectData.adress || "Non défini"}</span>,{" "}
                <span>{projectData.city || "Non défini"}</span>{" "}
                <span>{projectData.country || "Non défini"}</span>{" "}
              </p>
              <h3 className="font-semibold text-xl mt-2 mb-2">
                Presidential Towers
              </h3>

              <p className="text-gray-700">{projectData.des || "Non défini"}</p>

              <h2 className="font-semibold text-lg mb-4">
                Community Amenities
              </h2>
              <div className="flex flex-wrap gap-4 mt-4">
                {[Lift, Swim, Reception, Fitness, Cctv, Sauna, Disabled].map(
                  (Icon, i) => (
                    <div key={i} className="w-24">
                      <Icon />
                    </div>
                  )
                )}
              </div>

              <h2 className="font-semibold text-lg mb-4">Location</h2>
              <p className="text-gray-700">{projectData.des || "Non défini"}</p>

              <table className="table-auto w-full border border-gray-300 text-gray-700 text-xs">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Ref</th>
                    <th className="border p-2">Bedrooms</th>
                    <th className="border p-2">Surface</th>
                    <th className="border p-2">Floor</th>
                    <th className="border p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {["E4501", "E4502", "E4503"].map((ref, i) => (
                    <tr key={i} className="odd:bg-gray-50">
                      <td className="border p-2">{ref}</td>
                      <td className="border p-2 text-center">3</td>
                      <td className="border p-2">85 m²</td>
                      <td className="border p-2 text-center">3</td>
                      <td className="border p-2 font-semibold">250,000 PLN</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-1/3 pl-16 pt-16">
              <div
                id="sidebar"
                className={`${
                  isFixed
                    ? "fixed top-20  w-96" // La largeur reste constante à 1/3 et est fixée à droite
                    : "sticky top-20 w-96 " // Même largeur en sticky
                }`}
              >
                <div className="border text-gray-700 bg-white shadow-md rounded-sm w-full p-8">
                  <h1 className="mb-4 font-semibold text-2xl">
                    More information
                  </h1>
                  <button className="bg-[#755808] text-white px-3 py-1 w-full rounded-md text-sm">
                    Go to the proper website
                  </button>
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
