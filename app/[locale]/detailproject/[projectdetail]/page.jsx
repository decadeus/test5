"use client";
import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import i1 from "@/components/image/appart1.jpg";
import i2 from "@/components/image/appart2.jpg";
import i3 from "@/components/image/appart3.jpg";
import i4 from "@/components/image/beach.jpg";
import i5 from "@/components/image/beach2.jpg";
import Lift from "@/components/svg/lift.js";
import Swim from "@/components/svg/swim.js";
import PageM from "@/components/nmap.jsx";
import Reception from "@/components/svg/reception.js";
import Fitness from "@/components/svg/fitness.js";
import Cctv from "@/components/svg/cctv.js";
import Sauna from "@/components/svg/sauna.js";
import Disabled from "@/components/svg/disabled.js";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";


export default function ListProjectPage(){
  const { projectdetail } = useParams();
  const supabase = createClient();
  const [projectData, setProjectData] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  const [bottomReached, setBottomReached] = useState(false);


  useEffect(() => {
    const fetchValue = async () => {
      if (!projectdetail) return;

      const { data, error } = await supabase
        .from("project")
        .select()
        .eq("codepro", projectdetail)
        .single(); // On récupère un seul projet correspondant au slug

      if (error) {
        console.error("Erreur de récupération :", error);
      } else {
        setProjectData(data);
      }
    };

    fetchValue();
  }, [projectdetail, supabase]);


  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.getElementById("sidebar");
      const footer = document.getElementById("footer");
      const container = document.getElementById("content-container");
      if (!sidebar || !footer || !container) return;

      const sidebarRect = sidebar.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();

      setIsFixed(window.scrollY >= container.offsetTop);
      setBottomReached(sidebarRect.bottom >= footerRect.top);
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
          <div>
            <h2 className="font-semibold text-3xl mt-8 mb-2">
            {projectData.name || "Non défini"}
            </h2>
            <h3 className="font-semibold text-xl mt-2 mb-2">
              Presidential Towers
            </h3>
            <p className="text-gray-600 mb-4">A500 Piaswedcano Pologne</p>
            <p className="text-gray-700">
              Chicago’s reputation as one of America’s most distinctive cities
              owes a lot to the electric atmosphere and vibrant culture that
              defines Downtown Chicago. Iconic sites like Grant Park, Soldier
              Field, the Chicago Theatre, Navy Pier, and the Chicago Riverwalk
              are the most famous landmarks in Downtown, but that barely
              scratches the surface of what the neighborhood has to offer:
              dozens of theaters, live music venues, museums, and galleries fill
              the area, along with hundreds of shops and restaurants catering to
              every conceivable taste, plus the campuses of Columbia College
              Chicago, DePaul University, and the Art Institute of Chicago. The
              Loop, Greektown, River North, and the Magnificent Mile are all
              nearby, easily reached by a short ride on the train. There’s no
              shortage of swanky apartments and condos in Downtown Chicago, but
              you can often find great deals on studios as well, allowing you to
              live in the heart of the action even if you’re on a budget. dozens
              of theaters, live music venues, museums, and galleries fill the
              area, along with hundreds of shops and restaurants catering to
              every conceivable taste, plus the campuses of Columbia College
              Chicago, DePaul University, and the Art Institute of Chicago. The
              Loop, Greektown, River North, and the Magnificent Mile are all
              nearby, easily reached by a short ride on the train. There’s no
              shortage of swanky apartments and condos in Downtown Chicago, but
              you can often find great deals on studios as well, allowing you to
              live in the heart of the action even if you’re on a budget.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-4">Community Amenities</h2>
            <p className="text-gray-700 leading-relaxed">
              Chicago’s reputation as one of America’s most distinctive cities
              owes a lot to the electric atmosphere...
            </p>
            <div className="flex flex-wrap justify-start gap-4 mt-4">
  <div className="w-24">
    <Lift />
  </div>
  <div className="w-24">
    <Swim />
  </div>
  <div className="w-24">
    <Reception />
  </div>
  <div className="w-24">
    <Fitness />
  </div>
  <div className="w-24">
    <Cctv />
  </div>
  <div className="w-24">
    <Sauna />
  </div>
  <div className="w-24">
    <Disabled />
  </div>
</div>

          </div>
          <div>
            <h2 className="font-semibold text-lg mb-4">Location</h2>
            <p className="text-gray-700 leading-relaxed">
              Chicago’s reputation as one of America’s most distinctive cities
              owes a lot to the electric atmosphere...
            </p>
          </div>
          <table className="table-auto w-full border-collapse border border-gray-300 text-gray-700 text-xs">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2">Ref</th>
                <th className="border border-gray-300 p-2 w-fit">Bedrooms</th>
                <th className="border border-gray-300 p-2">Surface</th>
                <th className="border border-gray-300 p-2">Floor</th>
                <th className="border border-gray-300 p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {["E4501", "E4502", "E4503"].map((ref, index) => (
                <tr key={index} className="odd:bg-gray-50">
                  <td className="border border-gray-300 p-2">{ref}</td>
                  <td className="border border-gray-300 p-2 text-center w-fit">3</td>
                  <td className="border border-gray-300 p-2">85 m²</td>
                  <td className="border border-gray-300 p-2 text-center">3</td>
                  <td className="border border-gray-300 p-2 font-semibold">
                    250,000 PLN
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      

          <div id="footer">
            <h2 className="font-semibold text-lg">Same Company</h2>
          </div>
          <div className="flex gap-8">
            <div className="w-1/3 h-18">
              <Image
                src={i1}
                layout="responsive"
                width={32}
                height={16}
                alt="Project Image"
                className="object-cover rounded-sm"
              />
            </div>
            <div className="w-1/3 h-18">
              <Image
                src={i2}
                layout="responsive"
                width={32}
                height={16}
                alt="Project Image"
                className="object-cover rounded-sm"
              />
            </div>
            <div className="w-1/3 h-18">
              <Image
                src={i3}
                layout="responsive"
                width={32}
                height={16}
                alt="Project Image"
                className="object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
        <div className="w-1/3 flex flex-col justify-center p-4 relative">
        <div
  id="sidebar"
  className={`h-fit flex flex-col items-center transition-all duration-300 
    ${bottomReached ? "absolute bottom-0" : isFixed ? "fixed top-20 w-full" : " w-full"}`}
>

        <div className="border border-gray-200 text-gray-700 bg-white shadow-md rounded-sm w-full p-8">
          <h1 className="mb-4 font-semibold text-2xl">More information</h1>
          <button
            className="bg-[#755808] text-white px-3 py-1 w-full rounded-md text-sm"
            aria-label="Go to the proper website"
          >
            Go to the proper website
          </button>
          <hr className="border-gray-200 w-full my-4" />
          <p>Language: English</p>
        </div>
        <div className="w-full">
          <PageM />
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
};


