"use client"; // Indicates that this component is a client component

import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "@/navigation";
import { FaRegUser } from "react-icons/fa";

export function ConnectRes() {
  return (
    <>
      <Link href="/login" className="flex gap-2 justify-center items-center">
      <div className="w-8 flex justify-center items-center text-center"> <FaRegUser size={14} /></div>
      <div className="w-8 flex items-start text-center"><p className="text-white text-sm">Login</p></div>
       
        
      </Link>
    </>
  );
}

export default ConnectRes; // Keep a single default export
