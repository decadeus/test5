import React from "react";
import b from "@/components/b.png";
import Image from "next/legacy/image";
import { FaTwitter } from "react-icons/fa";

export default function Foot() {
  return (
    <footer className="bg-gray-300 flex py-4 border-t-1 border-gray-500 xl:px-12 px-4  gap-10 ">
      <div className="flex flex-col gap-2 justify-start items-start border-r-1 border-black pr-4 ">
        <div className="w-16 h-16 rounded-full">
          <Image
            src={b}
            width={50}
            height={50}
            alt="Logo"
            className="rounded-full"
          />
        </div>

        <div>
          <p className="text-md">© 2024 Decadeus</p>
        </div>
        <div className="flex flex-col justify-end items-end"></div>
      </div>
      <div className="flex-col content-between border-black pr-4 border-r-1 justify-center itenms-center">
        <div>
          <p className="text-2xl font-bold">Hoomge.com</p>
        </div>
        <div>
          <p>Terms and Conditions</p>
          <p>Add a Property Terms of Service</p>
        </div>
      </div>
      <div className="flex-col content-between ">
        <div className="border border-black rounded-full p-1 w-fit">
          <FaTwitter />
        </div>
      </div>
    </footer>
  );
}
