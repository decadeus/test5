import React from "react";
import b from "@/components/b.png";
import Image from "next/legacy/image";
import { FaTwitter } from "react-icons/fa";

export default function Foot() {
  return (
    <footer className="mt-10 bg-gray-700 py-8 xl:px-12 px-4 xl:gap-10 gap-4 text-gray-300">
  <div className="flex flex-col xl:flex-row justify-between items-center w-full">
    <div className="flex flex-col items-start">
      <p className="text-3xl font-bold text-white">Hoomge.com</p>
      <p className="text-sm text-gray-400">@2024 DECADEUS</p>
    </div>
    <div className="flex flex-col items-start">
      <p className="text-lg font-semibold hover:text-white cursor-pointer">Terms and Conditions</p>
      <p className="text-lg font-semibold hover:text-white cursor-pointer">Add a Property Terms of Service</p>
    </div>
    <div className="flex flex-col items-start text-gray-400">
      <p className="hover:text-white cursor-pointer">DEBEAUMONT@DECADEUS.COM</p>
      <div className="flex space-x-4 mt-2">
        <a href="#" className="hover:text-white">
          <i className="fab fa-facebook"></i> {/* Add your icon library for icons */}
        </a>
        <a href="#" className="hover:text-white">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="hover:text-white">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </div>
  </div>
</footer>
  );
}
