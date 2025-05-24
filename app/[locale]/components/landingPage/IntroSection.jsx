import Image from "next/legacy/image";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function IntroSection({
  t,
  searchTerm,
  setSearchTerm,
  loading,
  fetchProjectsA,
  locale,
  router,
}) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredCities = Array.from(
    new Map(
      fetchProjectsA
        .filter((p) => p.city?.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((p) => [p.city.toLowerCase(), { city: p.city, country: p.country || "N/A" }])
    ).values()
  );

  return (
    <div className="relative overflow-hidden w-full pb-10">
      <link rel="preload" href="/buildwhite.jpg" as="image" />
      
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollPosition * 0.2}px)` }}
      >
        <Image
          src="/buildwhite.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
          quality={50}
          className="object-center"
        />
      </div>

      <div className="absolute inset-0 bg-white opacity-60 z-10" />

      <div className="relative z-20 flex flex-col justify-between px-4 text-black">
        <div className="flex flex-col items-center gap-6 mt-16 sm:mt-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold max-w-3xl leading-tight">{t("title")}</h1>
          <p className="text-xl sm:text-2xl">{t("subtitle")}</p>
        </div>

        <div className="absolute left-0 w-full">
          <p className="text-[15rem] sm:text-[20rem] text-black opacity-5 font-satisfy text-left pl-4 sm:pl-40 leading-none select-none">
            H
          </p>
        </div>

        <div className="w-full flex justify-center pt-24">
          <div className="w-fit border-black border-2 rounded-3xl relative z-40 p-2 bg-white">
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Piaseczno, Warsaw, ..."
                className="w-full p-2 rounded pr-10 text-black placeholder:text-black outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
              />
              {searchTerm.length > 0 && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => setSearchTerm("")}
                >
                  ✖
                </button>
              )}
            </div>

            {!loading && searchTerm.length >= 2 && (
              <ul className="bg-white">
                {filteredCities.map(({ city, country }, i) => {
                  const regex = new RegExp(`(${searchTerm})`, "gi");
                  const highlighted = city.split(regex).map((part, j) =>
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                      <strong key={j} className="text-red-500">{part}</strong>
                    ) : (
                      part
                    )
                  );

                  return (
                    <li
                      key={i}
                      className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                      onClick={() => {
                        setSearchTerm(city);
                        localStorage.setItem("selectedCity", city);
                        localStorage.setItem("selectedCountry", country);
                        setTimeout(() => router.push(`/${locale}/projects`), 500);
                      }}
                    >
                      <span>{highlighted}</span>
                      <span className="text-gray-500 ml-2">{country}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
