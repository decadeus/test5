import React from "react";
import { createClient } from "@/utils/supabase/server";
import Appart from "./appart";
import Avatar from "@/app/getimage/getone";
import { MdBalcony } from "react-icons/md";
import { FaDog } from "react-icons/fa";
import {
  FaElevator,
  FaSchoolCircleCheck,
  FaBasketShopping,
  FaBaby,
  FaGasPump,
  FaPlaneDeparture,
  FaGraduationCap,
  FaKey,
  FaMasksTheater,
  FaMugHot,
  FaMountain,
  FaNetworkWired,
  FaUmbrellaBeach,
  FaWheelchair,
  FaWheelchairMove,
} from "react-icons/fa6";
import { GiParkBench } from "react-icons/gi";
import { MdOutlinePool, MdFitnessCenter } from "react-icons/md";
import { IoMdBicycle } from "react-icons/io";


export default async function Page({ params }) {
  const supabase = createClient();
  const id = params.residence; // Extracting 'id' from params

  const { data, error } = await supabase
    .from("residence")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="w-full px-40 flex justify-center items-center">
        <h1 className="text-4xl font-bold">Error loading data</h1>
      </div>
    );
  }

  return (
    <div className="w-full lg:px-20 md:px-10 sm:px-5">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl font-bold">{data?.mainTitle}</h1>
      </div>
      <div className="flex flex-col gap-20 justify-center">
        <div className="flex flex-col items-center">
          <div className="w-full h-[600px]">
            <Avatar
              url={data?.mainpic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex w-1/2 justify-center items-center">
            <div className="flex flex-col gap-8">
              <p className="text-2xl font-bold">{data.t1}</p>
              <p>{data.d1}</p>
            </div>
          </div>
          <div className="w-1/2 h-[400px]">
            <Avatar
              url={data?.secondpic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="w-1/2 h-[400px]">
            <Avatar
              url={data?.threepic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <div className="flex flex-col gap-8">
              <p className="text-2xl font-bold">{data.t2}</p>
              <p className="">{data.d2}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
      <div className="border p-4 flex flex-col justify-center items-center text-center gap-2">
        <div className="flex justify-center"><IconeS specificValue={data?.aut1} size={30}/></div>
        <p className="font-bold">{data?.taut1}</p>
        <p>{data?.daut1}</p>
        </div>
        <div className="border p-4 flex flex-col justify-center items-center text-center gap-2">
        <div className="flex justify-center"><IconeS specificValue={data?.aut2} size={30}/></div>
        <p className="font-bold">{data?.taut2}</p>
        <p>{data?.daut2}</p>
        </div>
        <div className="border p-4 flex flex-col justify-center items-center text-center gap-2">
        <div className="flex justify-center"><IconeS specificValue={data?.aut3} size={30}/></div>
        <p className="font-bold">{data?.taut3}</p>
        <p>{data?.daut3}</p>
        </div>
        </div>
      <div className="border-2 flex justify-center items-center text-center">
        <Appart value={data?.id} />
      </div>
    </div>
  );
}

function IconeS({ specificValue, size }) {
  const iconComponents = [
    {
      value: 1,
      icon: <MdBalcony size={size}  />,
    },
    {
      value: 2,
      icon: <FaElevator size={size} />,
    },
    {
      value: 3,
      icon: <FaDog size={size}  />,
    },
    {
      value: 4,
      icon: <FaSchoolCircleCheck size={size}  />,
    },
    {
      value: 5,
      icon: <GiParkBench size={size} />,
    },
    {
      value: 6,
      icon: <FaBasketShopping size={size}  />,
    },
    {
      value: 7,
      icon: <FaBaby size={size}  />,
    },
    {
      value: 8,
      icon: <MdOutlinePool size={size}  />,
    },
    {
      value: 9,
      icon: <FaGasPump size={size}  />,
    },
    {
      value: 10,
      icon: <FaPlaneDeparture size={size}  />,
    },
    {
      value: 11,
      icon: <MdFitnessCenter size={size}  />,
    },
    {
      value: 12,
      icon: <IoMdBicycle size={size}  />,
    },
    {
      value: 13,
      icon: <FaGraduationCap size={size}  />,
    },
    {
      value: 14,
      icon: <FaKey size={size}  />,
    },
    {
      value: 15,
      icon: <FaMasksTheater size={size} />,
    },
    {
      value: 16,
      icon: <FaWheelchairMove size={size}  />,
    },
  ];

  const selectedIconComponent = iconComponents.find(component => component.value === specificValue);

  return (
    <div className="flex flex-wrap gap-2">
      {selectedIconComponent ? (
        <div key={selectedIconComponent.value} >
          {selectedIconComponent.icon}
        </div>
      ) : (
        <p>Icon not found</p>
      )}
    </div>
  );
}
