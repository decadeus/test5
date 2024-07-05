import React from "react";
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
  FaSquareParking
  
} from "react-icons/fa6";
import { GiParkBench } from "react-icons/gi";
import { MdOutlinePool, MdFitnessCenter } from "react-icons/md";
import { IoMdBicycle } from "react-icons/io";

export const iconComponents = (size) => [
  { value: 1, icon: <MdBalcony size={size} /> },
  { value: 2, icon: <FaDog size={size} /> },
  { value: 3, icon: <FaBaby size={size} /> },
  { value: 4, icon: <FaGasPump size={size} /> },
  { value: 5, icon: <FaPlaneDeparture size={size} /> },
  { value: 6, icon: <FaGraduationCap size={size} /> },
  { value: 7, icon: <FaKey size={size} /> },
  { value: 8, icon: <FaElevator size={size} /> },
  { value: 9, icon: <FaSchoolCircleCheck size={size} /> },
  { value: 10, icon: <FaBasketShopping size={size} /> },
  { value: 11, icon: <FaMasksTheater size={size} /> },
  { value: 12, icon: <FaMugHot size={size} /> },
  { value: 13, icon: <FaMountain size={size} /> },
  { value: 14, icon: <FaNetworkWired size={size} /> },
  { value: 15, icon: <FaUmbrellaBeach size={size} /> },
  { value: 16, icon: <FaWheelchair size={size} /> },
  { value: 17, icon: <FaWheelchairMove size={size} /> },
  { value: 18, icon: <GiParkBench size={size} /> },
  { value: 19, icon: <MdOutlinePool size={size} /> },
  { value: 20, icon: <MdFitnessCenter size={size} /> },
  { value: 21, icon: <IoMdBicycle size={size} /> },
  { value: 22, icon: <FaSquareParking size={size} /> },
];

function IconeS({ specificValue, size }) {
  const icons = iconComponents(size);
  const selectedIconComponent = icons.find(
    (component) => component.value === specificValue
  );

  return (
    <div className="flex justify-center items-center rounded-full border p-2">
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

export default IconeS;
