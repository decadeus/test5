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
        
        <FaRegUserCircle
          size={35}
          color="white"
          className="rounded-full p-1"
        />
      </div>
    </Link>
  );
}
