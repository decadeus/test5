"use client";

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
  return (
    <div className="flex flex-col md:flex-row w-full px-4 sm:px-6 md:px-10 xl:px-16 py-8 sm:py-12 md:py-16">
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Optimisez la commercialisation de vos projets immobiliers résidentiels</h2>
        <p className="mb-4">Une web app dédiée aux promoteurs immobiliers. Centralisez vos projets, invitez vos collaborateurs, et précisez les équipements proposés dans chaque programme.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Suivi par ville, projet, contact</li>
          <li>Gestion des collaborateurs selon l'abonnement</li>
          <li>Tableau de bord personnalisé</li>
          <li>Formules simples et sans engagement</li>
        </ul>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-8 items-center justify-center">
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
