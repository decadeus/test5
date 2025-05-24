"use client";

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
    <div className="flex md:flex-row w-full">
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Optimisez la commercialisation de vos projets immobiliers résidentiels</h2>
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
              className={`rounded-full shadow-2xl flex items-center justify-center ${logo.bg} ${logo.offset} ${logo.size}`}
            >
              <a
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${logo.bg === "bg-white" || logo.bg === "bg-cyan-500" ? "text-black" : "text-white"} font-semibold text-center`}
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
              className={`rounded-full shadow-2xl flex items-center justify-center ${logo.bg} ${logo.offset} ${logo.size}`}
            >
              <a
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
              ></a>
              <span className={`${logo.bg === "bg-white" || logo.bg === "bg-cyan-500" ? "text-black" : "text-white"} font-semibold text-center`}>
                {logo.alt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
