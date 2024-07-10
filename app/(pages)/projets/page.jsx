"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import Image from "next/image";
import Im from "@/components/image/appart3.jpg";

export default function Page() {
  // Define a constant map with song data
  const songData = [
    {
      rooms: 3,
      surface: 50,
      prestations: 1961,
      level: "RDC",
      Price: "15 000 Pln",
      Detail: "Details",
      songAData: [{ bien: "RDC", Pabien: "15 000 Pln" }],
    },
    {
      rooms: 2,
      surface: 100,
      prestations: 1961,
      level: 2,
      Price: "1000",
      Detail: "Details",
      songAData: [{ bien: "RDC", Pabien: "15 000 Pln" }],
    },
    {
      rooms: 4,
      surface: 120,
      prestations: 1961,
      level: 20,
      Price: "1000",
      Detail: "Details",
      songAData: [{ bien: "RDC", Pabien: "15 000 Pln" }],
    },
    {
      rooms: 3,
      surface: 90,
      prestations: 1961,
      level: 4,
      Price: "1000",
      Detail: "Details",
      songAData: [{ bien: "RDC", Pabien: "15 000 Pln" }],
    },
  ];

  return (
    <div className="w-full">
      <Appartement songs={songData} />
    </div>
  );
}

function Appartement({ songs }) {
  return (
    <div className="w-full flex-col flex gap-16">
      <div
        className="relative overflow-hidden  bg-cover bg-no-repeat w-full"
        style={{
          backgroundImage: `url(${Im.src})`,
          height: "400px",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="bg-black w-fit p-16 flex justify-start">
        <p className="relative text-white font-bold text-3xl z-10">
          Find your dream apartment <br /> and residence
        </p>
        </div>
      </div>
      <div className="flex flex-col gap-64">
      <div className="flex px-32 gap-8 ">
        <div className="w-1/2 flex justify-center items-center">
          <div>
            <h2>Lorem ipsum dolor sit </h2>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo, non dolorem illo aperiam debitis, reiciendis facilis neque facere repellendus aut sequi laudantium odio natus ipsam ratione, sed ex quas accusantium.</p>
          </div>
        </div>
        <div className="w-1/2 h-[300px] ">
          <Image src={Im} alt="appart" />
        </div>
      </div>
      <div className="flex flex-row-reverse px-32 gap-8 ">
        <div className="w-1/2 flex justify-center items-center ">
          <div>
          <h2>Lorem ipsum dolor sit </h2>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo, non dolorem illo aperiam debitis, reiciendis facilis neque facere repellendus aut sequi laudantium odio natus ipsam ratione, sed ex quas accusantium.</p>
          </div>
        </div>
        <div className="w-1/2 h-[400px] ">
          <Image src={Im} alt="appart"/>
        </div>
      </div>
      </div>
      <div>
        <Tab songs={songs} />
      </div>
    </div>
  );
}

function Pop({ Price }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        className="bg-transparent rounded-full border-black border hover:rotate-45"
      >
        <FaPlus />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p className="text-black">{Price}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function Tab({ songs }) {
  return (
    <div className="overflow-x-auto bg-white md:px-64">
      <table
        className="min-w-full text-left text-xs whitespace-nowrap border-separate"
        style={{ borderSpacing: "0 10px" }}
      >
        <thead className="uppercase tracking-wider bg-neutral-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 border-b border-t border-gray-300"
            >
              Rooms
            </th>
            <th
              scope="col"
              className="px-6 py-3 border-b border-t border-gray-300"
            >
              Surface
            </th>
            <th
              scope="col"
              className="px-6 py-3 border-b border-t border-gray-300"
            >
              Prestations
            </th>
            <th
              scope="col"
              className="px-6 py-3 border-b border-t border-gray-300"
            >
              Level
            </th>
            <th
              scope="col"
              className="px-6 py-3 border-b border-t border-gray-300"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 border-b border-t border-gray-300"
            >
              Detail
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index} className="group hover:bg-slate-200">
              <td
                scope="row"
                className="px-6 py-3 border-t border-b border-l rounded-tl-lg rounded-bl-lg border-red-600 "
              >
                {song.rooms}
              </td>
              <td className="px-6 py-3 border-t border-b border-red-600 ">
                {song.surface} m2
              </td>
              <td className="px-6 py-3 border-t border-b border-red-600 ">
                {song.songAData.map((data, subIndex) => (
                  <div key={subIndex} className="flex-col">
                    <p>{data.bien}</p>
                    <p>{data.Pabien}</p>
                  </div>
                ))}
              </td>
              <td className="px-6 py-3 border-t border-b border-red-600 ">
                {song.level}
              </td>
              <td className="px-6 py-3 border-t border-b border-red-600 ">
                {song.Price}
              </td>
              <td className="px-6 py-3 border-t border-b rounded-tr-lg rounded-br-lg border-r border-red-600 ">
                <Pop Price={song.Price} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
