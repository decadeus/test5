import React from "react";
import b from "@/components/b.png";
import Image from "next/legacy/image";
import { FaTwitter } from "react-icons/fa";

export default function Foot() {
  return (
    <footer className="bg-gray-300 flex py-4 border-t-1 border-gray-500 xl:px-12 px-4  xl:gap-10 gap-2 ">
     <div className="flex flex-col xl:flex-row xl:gap-2 justify-start items-start border-r-1 border-black xl:pr-4 pr-2">
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
    <p className="text-md">Decadeus</p>
    <p className="text-md">© 2024</p>
  </div>

  <div className="flex flex-col xl:justify-end xl:items-end"></div>
</div>

      <div className="flex flex-col xl:flex-row justify-between xl:border-black xl:pr-4 pr-2 xl:border-r-1 text-center w-full">
  <div>
    <p className="text-2xl font-bold">Hoomge.com</p>
  </div>
  <div>
    <p>Terms and Conditions</p>
    <p>Add a Property Terms of Service</p>
  </div>
</div>
    </footer>
  );
}
