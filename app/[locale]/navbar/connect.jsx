"use client"; // Indicates that this component is a client component

import React from "react";

import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "@/navigation";
 // Import the texts for different languages

export default function Connect() {
  // Use the language context to get the current language
  

  return (
    <Link
      href="/login"
      className=""
    >
      <div className="">
        
      <div className="rounded-lg  border-2 p-2">
         <p className="text-white">Login</p>
        </div>
      </div>
    </Link>
  );
}
