"use client"; // Indicates that this component is a client component

import React from "react";

import { FaUser } from "react-icons/fa";
import { Link } from "@/navigation";
 // Import the texts for different languages

export default function Connect() {
  // Use the language context to get the current language
  

  return (
    <Link
      href="/login"
      className="w-fit border pl-2 py-1 rounded-sm border-white"
    >
      <div className="flex gap-2 items-center mr-4 text-white">
        <p>Se connecter</p> {/* Dynamically get the connect text based on the current language */}
        <FaUser
          size={25}
          color="white"
          className="rounded-full p-1"
        />
      </div>
    </Link>
  );
}
