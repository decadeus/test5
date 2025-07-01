import React from "react";
import LinK from "next/link";
import Image from "next/image";
import { FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" py-3 bg-gray-700  px-3 sm:px-6 text-gray-300 md:mb-24 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left w-full space-y-2 sm:space-y-0 sm:space-x-6">
        {/* Left Section */}
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-md sm:text-2xl font-bold text-white">Hoomge.com</p>
          <p className="text-xs sm:text-sm text-gray-300">@2024 DECADEUS</p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col items-center sm:items-start">
          <LinK
         
            href="/en/GDPR">GDPR
          
          </LinK>
          <LinK
         
         href="/en/privacy">Privacy Policy
       
       </LinK>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center sm:items-start text-gray-300">
          <p className="text-xs sm:text-sm hover:text-white cursor-pointer">
            HOOMGE@DECADEUS.COM
          </p>
          <div className="flex space-x-2 mt-1">
            <a href="#" className="hover:text-white">
              <i className="fab fa-facebook"></i>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="hover:text-white">
              <i className="fab fa-twitter"></i>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="hover:text-white">
              <i className="fab fa-instagram"></i>
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>

        {/* Section Application Mobile */}
        <div className="flex flex-col items-center sm:items-start mt-2">
          <div className="flex gap-2">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Image src="/applestore.png" alt="Disponible sur l'App Store" width={120} height={40} style={{ height: 40 }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Image src="/androidstore.png" alt="Disponible sur Google Play" width={120} height={40} style={{ height: 40 }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
