import React from "react";
import b from "@/components/b.png";
import Image from "next/legacy/image";
import { FaTwitter } from "react-icons/fa";

export default function Foot() {
  return (
    <footer className="mt-8 flex py-4 xl:px-12 px-4  xl:gap-10 gap-2 ">
      <div className="flex flex-col xl:flex-row justify-between  xl:pr-4 pr-2 text-center w-full text-gray-500 items-center ">
      <div className="font-bold flex flex-col justify-start items-start">
          <p className="text-2xl font-bold ">Hoomge.com</p>
          <p className="text-sm">@DECADEUS.2024</p>
        </div>
        <div className="font-bold flex flex-col justify-start items-start">
          <p>Terms and Conditions</p>
          <p>Add a Property Terms of Service</p>
        </div>
        <div> DEBEAUMONT@DECADEUS.COM</div>
      </div>
    </footer>
  );
}
