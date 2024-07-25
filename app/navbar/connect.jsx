"use client";
import React from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";


export default function Connect() {


  return (
    <>
  
      <Link
       href="/login"
      
        className="w-fit border pl-2 rounded-2xl border-white"
      >
        <div className="flex gap-2 items-center  mr-4 text-white">
          <IoMenu />
          <FaUser
            size={25}
            color="white"
            className="rounded-full bg-gray-600 p-1"
          />
        </div>
      </Link>
      
    
    </>
  );
}
