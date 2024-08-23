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
      
        className="w-fit border pl-2 py-1 rounded-sm border-black"
      >
        <div className="flex gap-2 items-center  mr-4 text-black">
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
