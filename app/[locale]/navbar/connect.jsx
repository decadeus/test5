"use client"; // Indicates that this component is a client component

import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import Link from "next/link";

export function Connect({selectedLanguage}) {
  return (
    <div className="flex justify-center items-center gap-8">
      <Link href={`/${selectedLanguage}/login`} className="">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-700 text-green-700 font-semibold bg-white/70 hover:bg-green-700 hover:text-white transition text-base"
        >
          <FaRegUserCircle size={20} />
          Se connecter
        </button>
      </Link>
    </div>
  );
}


export default Connect; // Keep a single default export
