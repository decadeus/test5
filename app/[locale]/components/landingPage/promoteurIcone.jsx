"use client";

import { useTranslations } from "next-intl";

const logos = [
  {
    alt: "Erply",
    bg: "bg-cyan-500",
    offset: "translate-y-1",
    size: "w-12 h-12 sm:w-16 sm:h-16",
    link: "https://www.adobe.com",
  },
  {
    alt: "RetailRealm",
    bg: "bg-white",
    offset: "-translate-y-3",
    size: "w-16 h-16 sm:w-20 sm:h-20",
    link: "https://www.adobe.com",
  },
  {
    alt: "Ingenico",
    bg: "bg-white",
    offset: "translate-y-3",
    size: "w-12 h-12 sm:w-16 sm:h-16",
    link: "https://www.adobe.com",
  },
  {
    alt: "Oracle",
    bg: "bg-red-600",
    offset: "-translate-y-2",
    size: "w-20 h-20 sm:w-24 sm:h-24",
    link: "https://www.adobe.com",
  },
];

const logos2 = [
  {
    alt: "Adobe",
    bg: "bg-red-600",
    offset: "translate-y-2",
    size: "w-20 h-20 sm:w-24 sm:h-24",
    link: "https://www.adobe.com",
  },
  {
    alt: "FreedomPay",
    bg: "bg-white",
    offset: "-translate-y-4",
    size: "w-16 h-16 sm:w-20 sm:h-20",
    link: "https://www.adobe.com",
  },
  {
    alt: "Erply",
    bg: "bg-cyan-500",
    offset: "translate-y-1",
    size: "w-12 h-12 sm:w-16 sm:h-16",
    link: "https://www.adobe.com",
  },
];

export default function LogoCloud() {
  const t = useTranslations("PromoBlock");
  return (
    <div className="flex flex-col md:flex-row w-full px-4 sm:px-6 md:px-10 xl:px-16 py-8 sm:py-12 md:py-16">
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t("title")}</h2>
        <p className="mb-4">{t("desc")}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t("item1")}</li>
          <li>{t("item2")}</li>
          <li>{t("item3")}</li>
          <li>{t("item4")}</li>
        </ul>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-8 items-center justify-center">
        <div className="flex justify-center mb-8">
          <svg width="500" height="320">
            {/* Dashboard central */}
            <rect x="200" y="120" width="100" height="70" rx="14" fill="#fff" stroke="#222" strokeWidth="3" />
            {/* Petits carrés dashboard */}
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <rect key={i} x={215+30*(i%3)} y={135+20*Math.floor(i/3)} width="10" height="10" fill="#222" rx="2" />
            ))}
            {/* Branches */}
            <line x1="250" y1="120" x2="120" y2="60" stroke="#222" strokeWidth="2" />
            <line x1="300" y1="120" x2="420" y2="60" stroke="#222" strokeWidth="2" />
            <line x1="200" y1="155" x2="80" y2="250" stroke="#222" strokeWidth="2" />
            <line x1="300" y1="190" x2="420" y2="250" stroke="#222" strokeWidth="2" />
            {/* Icône localisation + texte */}
            <g>
              <circle cx="120" cy="60" r="22" fill="#fff" stroke="#222" strokeWidth="2" />
              <circle cx="120" cy="68" r="7" fill="#222" />
              <path d="M120 82 Q110 70 120 60 Q130 70 120 82" fill="#222" />
              <text x="60" y="105" fontSize="15" fill="#222">{t("item1")}</text>
            </g>
            {/* Icône collaborateurs + texte */}
            <g>
              <circle cx="420" cy="60" r="22" fill="#fff" stroke="#222" strokeWidth="2" />
              <circle cx="420" cy="60" r="7" fill="#222" />
              <circle cx="434" cy="60" r="7" fill="#222" />
              <circle cx="406" cy="60" r="7" fill="#222" />
              <text x="340" y="105" fontSize="15" fill="#222">{t("item2")}</text>
            </g>
            {/* Icône graphique + texte */}
            <g>
              <rect x="65" y="250" width="8" height="30" fill="#222" rx="2" />
              <rect x="80" y="265" width="8" height="15" fill="#222" rx="2" />
              <rect x="95" y="240" width="8" height="40" fill="#222" rx="2" />
              <polyline points="65,270 80,265 95,240" fill="none" stroke="#222" strokeWidth="2" />
              <text x="30" y="300" fontSize="15" fill="#222">{t("item3")}</text>
            </g>
            {/* Icône maison + texte */}
            <g>
              <rect x="410" y="250" width="30" height="20" fill="#fff" stroke="#222" strokeWidth="2" rx="4" />
              <polygon points="425,240 410,250 440,250" fill="#fff" stroke="#222" strokeWidth="2" />
              <circle cx="435" cy="265" r="6" fill="#fff" stroke="#222" strokeWidth="2" />
              <polyline points="432,265 435,268 438,262" fill="none" stroke="#222" strokeWidth="2" />
              <text x="350" y="300" fontSize="15" fill="#222">{t("item4")}</text>
            </g>
          </svg>
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {logos.map((logo, index) => (
            <div
              key={index}
              className={`rounded-full shadow-2xl flex items-center justify-center min-w-[5rem] min-h-[5rem] ${logo.bg} ${logo.offset} ${logo.size}`}
            >
              <a
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${logo.bg === "bg-white" || logo.bg === "bg-cyan-500" ? "text-black" : "text-white"} font-semibold text-center text-[10px] sm:text-xs md:text-sm`}
              >
                {logo.alt}
              </a>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {logos2.map((logo, index) => (
            <div
              key={index}
              className={`rounded-full shadow-2xl flex items-center justify-center min-w-[5rem] min-h-[5rem] ${logo.bg} ${logo.offset} ${logo.size}`}
            >
              <a
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
              ></a>
              <span className={`${logo.bg === "bg-white" || logo.bg === "bg-cyan-500" ? "text-black" : "text-white"} font-semibold text-center text-[10px] sm:text-xs md:text-sm`}>
                {logo.alt}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
