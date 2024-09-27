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
      
        className="w-fit border pl-2 py-1 rounded-sm border-white"
      >
        <div className="flex gap-2 items-center  mr-4 text-white">
          <p>Connect</p>
          <FaUser
            size={25}
            color="white"
            className="rounded-full  p-1"
          />
        </div>
      </Link>
      
    
    </>
  );
}
