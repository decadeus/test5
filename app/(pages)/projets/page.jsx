"use client";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import Image from "next/image";
import Im from "@/components/image/appart3.jpg";
import archi from "@/components/image/plan_archi.jpg";

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
      songAData: {
        ref: "ref: 233N4BB",
        DateDispo: "Livraison prevu pour le 12/09/2025",
        City: "Warsaw",
        Residence: "Residence name",
        PriceP: "230 000 Pln",
        rooms: "3 pieces",
        surface: "54 m2",
        Ann1: "Ann1",
        Ann2: "Ann2",
        Ann3: "Ann3",
        Ann4: "Ann4",
        Ann5: "Ann5",
        tAnn1: "dAnn1",
        tAnn2: "dAnn2",
        tAnn3: "dAnn3",
        tAnn4: "dAnn4",
        tAnn5: "dAnn5",
      },
    },
    {
      rooms: 2,
      surface: 100,
      prestations: 1961,
      level: 2,
      Price: "1000",
      Detail: "Details",
      songAData: {
        ref: "ref",
        DateDispo: "Livraison prevu pour le 12/09/2025",
        City: "Warsaw",
        Residence: "Residence name",
        PriceP: "230 000 Pln",
        rooms: "3 pieces",
        surface: "54 m2",
        Ann1: "Ann1",
        Ann2: "Ann2",
        Ann3: "Ann3",
        Ann4: "Ann4",
        Ann5: "Ann5",
        tAnn1: "dAnn1",
        tAnn2: "dAnn2",
        tAnn3: "dAnn3",
        tAnn4: "dAnn4",
        tAnn5: "dAnn5",
      },
    },
    {
      rooms: 4,
      surface: 120,
      prestations: 1961,
      level: 20,
      Price: "1000",
      Detail: "Details",
      songAData: {
        ref: "ref",
        DateDispo: "Livraison prevu pour le 12/09/2025",
        City: "Warsaw",
        Residence: "Residence name",
        PriceP: "230 000 Pln",
        rooms: "3 pieces",
        surface: "54 m2",
        Ann1: "Ann1",
        Ann2: "Ann2",
        Ann3: "Ann3",
        Ann4: "Ann4",
        Ann5: "Ann5",
        tAnn1: "dAnn1",
        tAnn2: "dAnn2",
        tAnn3: "dAnn3",
        tAnn4: "dAnn4",
        tAnn5: "dAnn5",
      },
    },
    {
      rooms: 3,
      surface: 90,
      prestations: 1961,
      level: 4,
      Price: "1000",
      Detail: "Details",
      songAData: {
        refA: "ref",
        DateDispo: "DateDispo",
        City: "City",
        Residence: "Residence",
        PriceP: "Price",
        Rooms: "Rooms",
        surface: "surface",
        Ann1: "Ann1",
        Ann2: "Ann2",
        Ann3: "Ann3",
        Ann4: "Ann4",
        Ann5: "Ann5",
        tAnn1: "dAnn1",
        tAnn2: "dAnn2",
        tAnn3: "dAnn3",
        tAnn4: "dAnn4",
        tAnn5: "dAnn5",
      },
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center gap-16">
        <div>
      <Appartement songs={songData} />
      </div>
      <div>
      <button className=" bg-red-600 rounded-xl px-4 py-2 text-white text-xl">Nous contacter</button>
      </div>
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
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo,
                non dolorem illo aperiam debitis, reiciendis facilis neque
                facere repellendus aut sequi laudantium odio natus ipsam
                ratione, sed ex quas accusantium.
              </p>
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
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo,
                non dolorem illo aperiam debitis, reiciendis facilis neque
                facere repellendus aut sequi laudantium odio natus ipsam
                ratione, sed ex quas accusantium.
              </p>
            </div>
          </div>
          <div className="w-1/2 h-[400px] ">
            <Image src={Im} alt="appart" />
          </div>
        </div>
      </div>
      <div className="pt-16">
        <Tab songs={songs} />
      </div>
    </div>
  );
}

function Pop({
  Price,
  DateDispo,
  City,
  Residence,
  PriceP,
  Rooms,
  surface,
  Ann1,
  Ann2,
  Ann3,
  Ann4,
  Ann5,
  tAnn1,
  tAnn2,
  tAnn3,
  tAnn4,
  tAnn5,
  refA,
}) {
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        placement="top"
        className="px-0 py-0"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="w-full py-8 px-8">
                <div className="bg-gradient-to-br from-sky-900 to-blue-400 text-white w-full p-4 rounded-xl ">
                  <div className="flex justify-between items-center">
                    
                    <div className="flex items-center gap-16">
                      <p className="text-2xl font-bold">{Price}</p>
                      <p>{DateDispo}</p>
                    </div>
                    <div>
                      <p>{refA}</p>
                    </div>
                  </div>
                  <p className="text-2x font-semibold">{City}</p>
                  <p className="text-xl font-semibold">{Residence}</p>

                  <div className="flex gap-4">
                    <p>{Rooms}</p> <p>{surface}</p>
                  </div>
                </div>
                <div className="w-full ">
                  <Image src={archi} alt="appart" />

                  <div className="flex gap-2">
                    <div className="font-bold">
                      <p>{Ann1}</p>
                      <p>{Ann2}</p>
                      <p>{Ann3}</p>
                      <p>{Ann4}</p>
                      <p>{Ann5}</p>
                    </div>
                    <div className="">
                      <p>{tAnn1}</p>
                      <p>{tAnn2}</p>
                      <p>{tAnn3}</p>
                      <p>{tAnn4}</p>
                      <p>{tAnn5}</p>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function Tab({ songs }) {
  const colorB = "border-violet-900";
  const ps = "text-black font-bold";
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
            <tr key={index} className="group hover:bg-violet-200">
              <td
                scope="row"
                className={`px-6 py-3 border-t-4 border-b-4 border-l-4 rounded-tl-lg rounded-bl-lg ${colorB}`}
              >
                <p className={ps}>{song.rooms}</p>
              </td>
              <td className={`px-6 py-3 border-t-4 border-b-4 ${colorB}`}>
                <p className={ps}>{song.surface} m2</p>
              </td>
              <td className={`px-6 py-3 border-t-4 border-b-4 ${colorB}`}>
                <p className={ps}>{song.prestations}</p>
              </td>
              <td className={`px-6 py-3 border-t-4 border-b-4 ${colorB}`}>
                <p className={ps}>{song.level}</p>
              </td>
              <td className={`px-6 py-3 border-t-4 border-b-4 ${colorB}`}>
                <p className={ps}>{song.Price}</p>
              </td>
              <td
                className={`px-6 py-3 border-t-4 border-b-4 rounded-tr-lg rounded-br-lg border-r-4 ${colorB}`}
              >
                <Pop
                  Price={song.Price}
                  DateDispo={song.songAData.DateDispo}
                  City={song.songAData.City}
                  Residence={song.songAData.Residence}
                  PriceP={song.songAData.PriceP}
                  Rooms={song.songAData.rooms}
                  surface={song.songAData.surface}
                  Ann1={song.songAData.Ann1}
                  Ann2={song.songAData.Ann2}
                  Ann3={song.songAData.Ann3}
                  Ann4={song.songAData.Ann4}
                  Ann5={song.songAData.Ann5}
                  tAnn1={song.songAData.tAnn1}
                  tAnn2={song.songAData.tAnn2}
                  tAnn3={song.songAData.tAnn3}
                  tAnn4={song.songAData.tAnn4}
                  tAnn5={song.songAData.tAnn5}
                  refA={song.songAData.ref}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
