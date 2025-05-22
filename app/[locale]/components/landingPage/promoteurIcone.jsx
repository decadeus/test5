"use client";

import Image from "next/image";

const logos = [
  {
   
    alt: "Erply",
    bg: "bg-cyan-500",
    offset: "translate-y-1",
    size: "w-24 h-24",
    link: "https://www.adobe.com",
  },
  {
   
    alt: "RetailRealm",
    bg: "bg-white",
    offset: "-translate-y-3",
    size: "w-28 h-28",
    link: "https://www.adobe.com",
  },
  {
   
    alt: "Ingenico",
    bg: "bg-white",
    offset: "translate-y-3",
    size: "w-24 h-24",
    link: "https://www.adobe.com",
  },
  {
    
    alt: "Oracle",
    bg: "bg-red-600",
    offset: "-translate-y-2",
    size: "w-32 h-32",
    link: "https://www.adobe.com",
  },
];

const logos2 = [
  {
    
    alt: "Adobe",
    bg: "bg-red-600",
    offset: "translate-y-2",
    size: "w-32 h-32",
    link: "https://www.adobe.com",
  },
  {
    
    alt: "FreedomPay",
    bg: "bg-white",
    offset: "-translate-y-4",
    size: "w-28 h-28",
    link: "https://www.adobe.com",
  },
  {
    
    alt: "Erply",
    bg: "bg-cyan-500",
    offset: "translate-y-1",
    size: "w-24 h-24",
    link: "https://www.adobe.com",
  },
];

export default function LogoCloud() {
  return (
    <div className="py-20 px-4 bg-white">
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {logos.map((logo, index) => (
          <div
            key={index}
            className={`rounded-full shadow-2xl flex items-center justify-center ${logo.bg} ${logo.offset} ${logo.size}`}
          >
            <a
              key={index}
              href={logo.link}
              target="_blank"
              rel="noopener noreferrer"
             
            ></a>
           
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {logos2.map((logo, index) => (
          <div
            key={index}
            className={`rounded-full shadow-2xl flex items-center justify-center ${logo.bg} ${logo.offset} ${logo.size}`}
          >
            <a
              key={index}
              href={logo.link}
              target="_blank"
              rel="noopener noreferrer"
             
            ></a>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
