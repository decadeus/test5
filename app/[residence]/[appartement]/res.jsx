import React from "react";
import GoogleMaps from "./../googlemap";
import Adresse from "../adresse";
import Avatar from "@/app/getimage/getone";
import { MdBalcony } from "react-icons/md";
import { FaDog } from "react-icons/fa";
import BackLink from "./usepath";
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


export default function Res({
  mainTitle,
  mainpic,
  aut1,
  taut1,
  aut2,
  taut2,
  aut3,
  taut3,
  avan1,
  tavan1,
  avan2,
  tavan2,
  avan3,
  tavan3,
  lata,
  lnga,
  adresse,
  code_postal,
  city,
}) {
  const line = "flex text-center items-center gap-4 p-2";
  const text = "";
  return (
    <div className="w-full px-4 pt-4 border-l">
      <h2 className="text-center flex justify-center pb-4 font-bold text-2xl">La résidence</h2>
      <div className="h-[200px]">
        <Avatar url={mainpic} width={200} height={200} className="rounded-lg" />
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <div className={line}>
          <IconeS specificValue={aut1} size={20} />
          <p className={text}>{taut1}</p>
        </div>
        <div className={line}>
          <IconeS specificValue={aut2} size={20} />
          <p className={text}>{taut2}</p>
        </div>
        <div className={line}>
          <IconeS specificValue={aut3} size={20} />
          <p className={text}>{taut3}</p>
        </div>
       
      </div>
      <div className="pt-4 flex items-center w-full">
        <div className="w-1/2">
          <GoogleMaps lnga={lnga} lata={lata} height="h-48" />
         
        </div>
        <div className="w-1/2">
      <Adresse maintitle={mainTitle} adresse={adresse} code_postal={code_postal} city={city} />
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button className="bg-green-400 w-full text-white py-2 px-4">
      <BackLink >En savoir plus sur la residence</BackLink>
      </button>
      </div>
    </div>
  );
}

function IconeS({ specificValue, size }) {
  const iconComponents = [
    {
      value: 1,
      icon: <MdBalcony size={size} />,
    },
    {
      value: 2,
      icon: <FaElevator size={size} />,
    },
    {
      value: 3,
      icon: <FaDog size={size} />,
    },
    {
      value: 4,
      icon: <FaSchoolCircleCheck size={size} />,
    },
    {
      value: 5,
      icon: <GiParkBench size={size} />,
    },
    {
      value: 6,
      icon: <FaBasketShopping size={size} />,
    },
    {
      value: 7,
      icon: <FaBaby size={size} />,
    },
    {
      value: 8,
      icon: <MdOutlinePool size={size} />,
    },
    {
      value: 9,
      icon: <FaGasPump size={size} />,
    },
    {
      value: 10,
      icon: <FaPlaneDeparture size={size} />,
    },
    {
      value: 11,
      icon: <MdFitnessCenter size={size} />,
    },
    {
      value: 12,
      icon: <IoMdBicycle size={size} />,
    },
    {
      value: 13,
      icon: <FaGraduationCap size={size} />,
    },
    {
      value: 14,
      icon: <FaKey size={size} />,
    },
    {
      value: 15,
      icon: <FaMasksTheater size={size} />,
    },
    {
      value: 16,
      icon: <FaWheelchairMove size={size} />,
    },
  ];

  const selectedIconComponent = iconComponents.find(
    (component) => component.value === specificValue
  );

  return (
    <div className="">
      {selectedIconComponent ? (
        <div key={selectedIconComponent.value}>
          {selectedIconComponent.icon}
        </div>
      ) : (
        <p>Icon not found</p>
      )}
    </div>
  );
}
