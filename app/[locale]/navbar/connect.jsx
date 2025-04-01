"use client"; // Indicates that this component is a client component

import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import Link from "next/link";

export function Connect({selectedLanguage}) {
  return (
    <div className="flex justify-center items-center gap-8">
      <Link href={`/${selectedLanguage}/login`} className="">
        <div className="flex gap-4">
          <div className="rounded-lg border-black border-2 flex justify-center items-center">
            <p className="text-black text-sm px-1">Login</p>
          </div>
        </div>
      </Link>
    </div>
  );
}


export default Connect; // Keep a single default export
