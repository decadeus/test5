'use client'
import React from 'react';
import { useDisclosure, Modal, ModalContent, ModalBody, ModalFooter, Button, RadioGroup, Radio } from "@nextui-org/react";
import { MdBalcony, MdOutlinePool, MdFitnessCenter } from "react-icons/md";
import { FaElevator, FaDog, FaSchoolCircleCheck, FaBasketShopping, FaBaby, FaGasPump, FaPlaneDeparture, FaGraduationCap, FaKey, FaMasksTheater, FaWheelchairMove } from "react-icons/fa";
import { GiParkBench } from "react-icons/gi";
import { IoMdBicycle } from "react-icons/io";

export default function IconeS({
  main,
  edited,
  updateProfile,
  loading,
  setEdited,
  size = 30,
  maxLength,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const iconComponents = [
    { value: 1, icon: <MdBalcony size={size} /> },
    { value: 2, icon: <FaElevator size={size} /> },
    { value: 3, icon: <FaDog size={size} /> },
    { value: 4, icon: <FaSchoolCircleCheck size={size} /> },
    { value: 5, icon: <GiParkBench size={size} /> },
    { value: 6, icon: <FaBasketShopping size={size} /> },
    { value: 7, icon: <FaBaby size={size} /> },
    { value: 8, icon: <MdOutlinePool size={size} /> },
    { value: 9, icon: <FaGasPump size={size} /> },
    { value: 10, icon: <FaPlaneDeparture size={size} /> },
    { value: 11, icon: <MdFitnessCenter size={size} /> },
    { value: 12, icon: <IoMdBicycle size={size} /> },
    { value: 13, icon: <FaGraduationCap size={size} /> },
    { value: 14, icon: <FaKey size={size} /> },
    { value: 15, icon: <FaMasksTheater size={size} /> },
    { value: 16, icon: <FaWheelchairMove size={size} /> },
  ];

  const getIconByValue = (value) => {
    const iconComponent = iconComponents.find((component) => component.value === value);
    return iconComponent ? iconComponent.icon : null;
  };

  return (
    <div className='bg-red-300'>
   
      <button aria-label="open icon selection" className="text-start" onClick={onOpen}> Button
      
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex justify-center items-center p-8">
                  <RadioGroup
                    value={edited}
                    onValueChange={setEdited}
                    orientation="horizontal"
                  >
                    {iconComponents.map((component) => (
                      <Radio key={component.value} value={component.value}>
                        <p className="pr-8">{component.icon}</p>
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    updateProfile();
                    onClose();
                  }}
                  disabled={loading}
                >
                  {loading ? "Loading ..." : "Update"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

