import React from "react";
import GoogleMaps from "./../googlemap";
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
import { Button } from "@nextui-org/react";

export default function Res({ mainTitle, mainpic, aut1, taut1, aut2, taut2, aut3, taut3, avan1, tavan1, avan2, tavan2, avan3, tavan3, lata, lnga }) {
  const line = "flex flex-col border text-center items-center gap-4 p-2";
  const text = ""
  return (
    <div className="w-full px-4 pt-4">
      <div className="text-center font-bold text-xl pb-4">{mainTitle}</div>
      <div className="h-[200px]">
        <Avatar url={mainpic} width={200} height={200} className="rounded-lg" />
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 pt-4">
        <div className={line}>
          <IconeS specificValue={aut1} size={30} />
          <p className={text}>{taut1}</p>
        </div>
        <div className={line}>
          <IconeS specificValue={aut2} size={30} />
          <p className={text}>{taut2}</p>
        </div>
        <div className={line}>
          <IconeS specificValue={aut3} size={30} />
          <p className={text}>{taut3}</p>
        </div>
        <div className={line}>
          <IconeS specificValue={avan1} size={30} />
          <p className={text}>{tavan1}</p>
        </div>
        <div className={line}>
          <IconeS specificValue={avan2} size={30} />
          <p className={text}>{tavan2}</p>
        </div>
        <div className={line}>
          <IconeS specificValue={avan3} size={30} />
          <p className={text}>{tavan3}</p>
        </div>
      </div>
      <div className="pt-4">
      <div className="w-1/2">
          <GoogleMaps lnga={lnga} lata={lata} height="h-48" />
        </div>
      </div>
      <div className="flex justify-center pt-4">
      <Button color="primary" className="shadow-xl">En savoir plus sur la résidence</Button>
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
