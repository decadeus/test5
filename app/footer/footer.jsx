import React from "react";
import Image from "next/legacy/image";
import { FaTwitter } from "react-icons/fa";

export default function Foot() {
  return (
    <footer className=" py-3 bg-gray-700  px-3 sm:px-6 text-gray-300">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left w-full space-y-2 sm:space-y-0 sm:space-x-6">
        {/* Left Section */}
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-md sm:text-2xl font-bold text-white">Hoomge.com</p>
          <p className="text-xs sm:text-sm text-gray-400">@2024 DECADEUS</p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-xs sm:text-sm font-semibold hover:text-white cursor-pointer">
            Terms and Conditions
          </p>
          <p className="text-xs sm:text-sm font-semibold hover:text-white cursor-pointer">
            Add a Property Terms of Service
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center sm:items-start text-gray-400">
          <p className="text-xs sm:text-sm hover:text-white cursor-pointer">
            DEBEAUMONT@DECADEUS.COM
          </p>
          <div className="flex space-x-2 mt-1">
            <a href="#" className="hover:text-white">
              <i className="fab fa-facebook"></i>
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
