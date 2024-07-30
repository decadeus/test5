"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FaPlusCircle } from "react-icons/fa";
import Image from "next/image";
import Im from "@/components/image/appart3.jpg";
import Im2 from "@/components/image/appart2.jpg";
import Im1 from "@/components/image/appart1.jpg";
import archi from "@/components/image/plan_archi.jpg";
import { MdDateRange } from "react-icons/md";
import Adresse from "@/app/[residence]/adresse";
import Map from "@/components/map";
import { createClient } from "@/utils/supabase/client";

export default function Test() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("project").select("*, projectlist(*)").eq("id", 5);
      if (error) {
        setError(error);
      } else {
        setProjects(data);
      }
    };

    fetchProjects();
  }, []);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-16">
      <div>
        <Appartement projects={projects} />
      </div>
    </div>
  );
}

function Appartement({ projects }) {
  if (!projects || projects.length === 0) {
    return <div>No data available</div>;
  }

  const [firstProject] = projects;

  return (
    <div className="w-full flex-col flex">
      <div className="relative overflow-hidden bg-cover bg-no-repeat w-full" style={{ backgroundImage: `url(${Im.src})`, height: "400px" }}>
        <div className="absolute inset-0 "></div>
        <div className="bg-black p-16 flex justify-start flex-col w-1/2">
          <h1 className="relative text-white font-bold text-3xl z-10">
            {firstProject.t1}
          </h1>
          <p className="text-white">{firstProject.d1}</p>
        </div>
      </div>
      <div className="flex flex-col gap-32 pt-32">
        <div className="flex px-32 gap-8 ">
          <div className="w-1/2 flex justify-center items-center">
            <div>
              <h2 className="text-4xl font-extrabold">
                {firstProject.t2}
              </h2>
              <p className="pt-4">
                {firstProject.d2}
              </p>
            </div>
          </div>
          <div className="w-1/2 h-[400px] ">
            <Image src={Im2} alt="appart" layout="fill" objectFit="cover" />
          </div>
        </div>
        <div className="flex flex-row-reverse px-32 gap-8 ">
          <div className="w-1/2 flex justify-center items-center ">
            <div>
              <h2 className="text-4xl font-extrabold">
                {firstProject.t3}
              </h2>
              <p className="pt-4">
                {firstProject.d3}
              </p>
            </div>
          </div>
          <div className="w-1/2 h-[400px] ">
            <Image src={Im1} alt="appart" layout="fill" objectFit="cover" />
          </div>
        </div>
      </div>
      <div className="w-full justify-center flex">
        <div className="pt-32 w-fit ">
          <Tab2 projects={projects} />
        </div>
      </div>
      <div className="w-full pt-32 flex flex-col-reverse md:flex-row ">
        <div className="w-full">
          <Map lnga={42.4568} lata={42.4568} classN="w-full h-[400px]" />
        </div>
        <div className="flex justify-center items-center text-center w-full flex-col gap-16">
          <Adresse
            name="name"
            adresse="adresse"
            code_postal="code postal"
            city="city"
            adresse1="adresse 1"
            adresse2="adresse 2"
          />
          <button className="bg-emerald-500 rounded-xl px-4 py-2 text-white text-normal shadow-2xl flex gap-4">
            <p>Eiffage construction</p>
            <p>➼</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function Tab2({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Automatically select the first project on load
    if (projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  const handleRowClick = (project) => {
    setSelectedProject(project);
  };

  const colorB = "border-violet-900";
  const ps = "text-white font-bold text-center py-2";
  const Tt = "text-gray-500 font-extra-bold text-center px-2";

  return (
    <div className="overflow-x-auto bg-gray-700 flex w-full">
      <div className="w-1/2 px-8">
        <table
          className="min-w-full text-left text-xs whitespace-nowrap border-separate pt-4"
          style={{ borderSpacing: "0 10px" }}
        >
          <thead className="uppercase tracking-wider">
            <tr>
              <th scope="col" className={Tt}>
                REF
              </th>
              <th scope="col" className={Tt}>
                BED
              </th>
              <th scope="col" className={Tt}>
                BATH
              </th>
              <th scope="col" className={Tt}>
                FLOOR
              </th>
              <th scope="col" className={Tt}>
                GARDEN (m2)
              </th>
              <th scope="col" className={Tt}>
                SURFACE (m2)
              </th>
              <th scope="col" className={Tt}>
                AVAILABLE
              </th>
              <th scope="col" className={Tt}>
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) =>
              project.projectlist && project.projectlist.length > 0 ? (
                project.projectlist.map((listItem, listIndex) => (
                  <tr
                    key={`${index}-${listIndex}`}
                    className={`group cursor-pointer ${
                      selectedProject === project ? "bg-gray-900" : "hover:bg-gray-800"
                    }`}
                    onClick={() => handleRowClick(project)}
                  >
                    <td scope="row" className="text-center">
                      <p className={ps}>{listItem.ref}</p>
                    </td>
                    <td scope="row" className="text-center">
                      <p className={ps}>{listItem.bedrooms}</p>
                    </td>
                    <td className="">
                      <p className={ps}>{listItem.bathrooms}</p>
                    </td>
                    <td className="">
                      <p className={ps}>{listItem.floor}</p>
                    </td>
                    <td className="">
                      <p className={ps}>{listItem.jardin}</p>
                    </td>
                    <td className="">
                      <p className={ps}>{listItem.surface}</p>
                    </td>
                    <td className="">
                      <p className={ps}>{listItem.available}</p>
                    </td>
                    <td className="">
                      <p className={ps}>{listItem.price}</p>
                    </td>
                  </tr>
                ))
              ) : null
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-900 w-1/2 p-4">
        <div className="w-full">
          <div className="relative w-full h-[300px] ">
            <Image src={Im} alt="appart" layout="fill" objectFit="cover" />
          </div>
          {selectedProject ? (
            <div className="pt-4">
              <div className={`flex justify-between text-stone-400`}>
                <div className="flex gap2">
                  <p className="border-r-2 pr-2">Price: {selectedProject.price}</p>
                  <p className="border-r-2 pr-2 pl-2">
                    Bedrooms: {selectedProject.bedrooms}
                  </p>
                  <p className="pl-2">Surface: {selectedProject.surface} m2</p>
                </div>
                <div>
                  <p className="pr-2 flex justify-center items-center gap-2">
                    <MdDateRange />
                    available: {selectedProject.available}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white">
                Ref: {selectedProject.ref}
              </p>
              <div className="pt-4">
                <button className="bg-emerald-500 rounded-xl px-4 py-2 text-white text-normal shadow-2xl">
                  Plus d'information
                </button>
              </div>
            </div>
          ) : (
            <p>Click on a row to see more details</p>
          )}
        </div>
      </div>
    </div>
  );
}
