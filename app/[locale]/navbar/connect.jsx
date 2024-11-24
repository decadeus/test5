"use client"; // Indicates that this component is a client component

import React from "react";

import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "@/navigation";
import LangSwitcher from "../components/LangSwitcher";
// Import the texts for different languages

export default function Connect() {
  // Use the language context to get the current language

  return (
    <div className="flex justify-center items-center gap-8">
         <div className="flex items-center text-black ">
          <LangSwitcher />
        </div>

    <Link href="/login" className="">
      <div className="flex gap-4">
      
        <div className="rounded-lg border-black  border-2 flex justify-center items-center  ">
          <p className="text-black text-sm px-1">Login</p>
        </div>
      </div>
   
    </Link>
    </div>
  );
}
