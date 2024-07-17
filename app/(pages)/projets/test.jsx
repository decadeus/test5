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
import archi from "@/components/image/plan_archi.jpg";
import { MdDateRange } from "react-icons/md";

export default function Test() {
  const songData = [
    {
      ref: "504E",
      bedrooms: 2,
      bathrooms: 2,
      floor: 4,
      surface: 70,
      price: "zł 100 000",
      available: "12/09/2027",
      songAData: {
        ref: "ref: 233N4BB",
        DateDispo: "Livraison prevu pour le 12/09/2025",
        City: "Warsaw",
        Residence: "Residence name",
        PriceP: "230 000 Pln",
        rooms: "3 pieces",
        surface: "59 m2",
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
        LongTest:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, non dolorem illo aperiam debitis, reiciendis facilis neque facere repellendus aut sequi laudantium odio natus ipsam ratione, sed ex quas accusantium.",
      },
    },
    {
      ref: "504E",
      bedrooms: 3,
      bathrooms: 2,
      floor: 4,
      surface: 50,
      available: "12/09/2025",
      price: "zł 150 000",
      songAData: {
        ref: "ref: 233N4BB",
        DateDispo: "Livraison prevu pour le 12/09/2025",
        City: "Warsaw",
        Residence: "Residence name",
        PriceP: "230 000 Pln",
        rooms: "3 pieces",
        surface: "59 m2",
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
        LongTest:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, non dolorem illo aperiam debitis, reiciendis facilis neque facere repellendus aut sequi laudantium odio natus ipsam ratione, sed ex quas accusantium.",
      },
    },
    {
      ref: "504E",
      bedrooms: 3,
      bathrooms: 2,
      floor: 4,
      surface: 50,
      available: "12/09/2025",
      price: "zł 150 000",
      songAData: {
        ref: "ref: 233N4BB",
        DateDispo: "Livraison prevu pour le 12/09/2025",
        City: "Warsaw",
        Residence: "Residence name",
        PriceP: "230 000 Pln",
        rooms: "3 pieces",
        surface: "59 m2",
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
        LongTest:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, non dolorem illo aperiam debitis, reiciendis facilis neque facere repellendus aut sequi laudantium odio natus ipsam ratione, sed ex quas accusantium.",
      },
    },
    {
      ref: "504E",
      bedrooms: 3,
      bathrooms: 2,
      floor: 4,
      surface: 50,
      price: "zł 150 000",
      available: "12/09/2025",
      songAData: {
        ref: "ref: 233N4BB",
        DateDispo: "Livraison prevu pour le 12/09/2025",
        City: "Warsaw",
        Residence: "Residence name",
        PriceP: "230 000 Pln",
        rooms: "3 pieces",
        surface: "59 m2",
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
        LongTest:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, non dolorem illo aperiam debitis, reiciendis facilis neque facere repellendus aut sequi laudantium odio natus ipsam ratione, sed ex quas accusantium.",
      },
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center gap-16">
      <div>
        <Appartement songs={songData} />
      </div>
     
    </div>
  );
}

function Appartement({ songs }) {
  return (
    <div className="w-full flex-col flex gap-16">
      <div
        className="relative overflow-hidden bg-cover bg-no-repeat w-full"
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
      <div className="w-full justify-center flex">
        <div className="pt-32  w-fit ">
          <Tab2 songs={songs} />
        </div>
      </div>
    </div>
  );
}
function Tab2({ songs }) {
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    // Automatically select the first song on load
    if (songs.length > 0) {
      setSelectedSong(songs[0]);
    }
  }, [songs]);

  const handleRowClick = (song) => {
    setSelectedSong(song);
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
            {songs.map((song, index) => (
              <tr
                key={index}
                className={`group cursor-pointer  ${
                  selectedSong === song ? "bg-gray-900" : "hover:bg-gray-800"
                }`}
                onClick={() => handleRowClick(song)}
              >
                <td scope="row" className="text-center">
                  <p className={ps}>{song.ref}</p>
                </td>
                <td scope="row" className="text-center">
                  <p className={ps}>{song.bedrooms}</p>
                </td>
                <td className="">
                  <p className={ps}>{song.bathrooms}</p>
                </td>
                <td className="">
                  <p className={ps}>{song.floor}</p>
                </td>

                <td className="">
                  <p className={ps}>{song.surface}</p>
                </td>
                <td className="">
                  <p className={ps}>{song.available}</p>
                </td>
                <td className="">
                  <p className={ps}>{song.price}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-900 w-1/2 p-4">
     
        
       

        <div className="w-full">
        <div className="relative w-full h-[300px] ">
            <Image src={Im} alt="appart" layout="fill"
          objectFit="cover"/>
          </div>
          {selectedSong ? (
            <div className="pt-4">
              <div className={` flex justify-between text-stone-400`}>
                <div className="flex gap2">
                  <p className="border-r-2 pr-2">Price: {selectedSong.price}</p>
                  <p className="border-r-2 pr-2 pl-2">
                    Bedrooms: {selectedSong.bedrooms}
                  </p>
                  <p className="pl-2">Surface: {selectedSong.surface} m2</p>
                </div>
                <div>
                  <p className="pr-2 flex justify-center items-center gap-2">
                    <MdDateRange />
                    available: {selectedSong.available}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white">
                Ref: {selectedSong.songAData.LongTest}
              </p>
              <p className="text-sm text-white">
                Ref: {selectedSong.songAData.LongTest}
              </p>
              <p className="text-sm text-white">
                Ref: {selectedSong.songAData.LongTest}
              </p>
              <p className="text-sm text-white">
                Ref: {selectedSong.songAData.LongTest}
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
