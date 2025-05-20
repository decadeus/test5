"use client";

import Image from "next/image";

const logos = [
  {
    src: "/logos/erply.png",
    alt: "Erply",
    bg: "bg-cyan-500",
    offset: "translate-y-1",
    size: "w-24 h-24",
    link: "https://www.adobe.com",
  },
  {
    src: "/logos/retailrealm.png",
    alt: "RetailRealm",
    bg: "bg-white",
    offset: "-translate-y-3",
    size: "w-28 h-28",
    link: "https://www.adobe.com",
  },
  {
    src: "/logos/ingenico.png",
    alt: "Ingenico",
    bg: "bg-white",
    offset: "translate-y-3",
    size: "w-24 h-24",
    link: "https://www.adobe.com",
  },
  {
    src: "/logos/oracle.png",
    alt: "Oracle",
    bg: "bg-red-600",
    offset: "-translate-y-2",
    size: "w-32 h-32",
    link: "https://www.adobe.com",
  },
];

const logos2 = [
  {
    src: "/logos/adobe.png",
    alt: "Adobe",
    bg: "bg-red-600",
    offset: "translate-y-2",
    size: "w-32 h-32",
    link: "https://www.adobe.com",
  },
  {
    src: "/logos/freedompay.png",
    alt: "FreedomPay",
    bg: "bg-white",
    offset: "-translate-y-4",
    size: "w-28 h-28",
    link: "https://www.adobe.com",
  },
  {
    src: "/logos/erply.png",
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
