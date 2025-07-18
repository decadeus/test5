import React from "react";
import LinK from "next/link";
import Image from "next/legacy/image";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Foot() {
  return (
    <footer className=" py-3 bg-gray-700  px-3 sm:px-6 text-gray-300 md:pb-0 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left w-full space-y-2 sm:space-y-0 sm:space-x-6">
        {/* Left Section */}
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-md sm:text-2xl font-bold text-white">Hoomge.com</p>
          <p className="text-xs sm:text-sm text-gray-300">@2024 DECADEUS</p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col items-center sm:items-start">
          <LinK
            href="/fr/GDPR">Politique de confidentialité
          </LinK>
          <LinK
            href="/en/mentionlegal">Mentions légales
          </LinK>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center sm:items-start text-gray-300">
          <p className="text-xs sm:text-sm hover:text-white cursor-pointer">
            HOOMGE@DECADEUS.COM
          </p>
          <div className="flex space-x-2 mt-1">
            <a href="#" className="hover:text-white">
              <FaFacebook />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
