import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";

export default function IntroSection({
  t,
  uniqueCompanies,
  uniqueIdeas,
  totalApartments,
  searchTerm,
  setSearchTerm,
  fetchProjectsA,
  loading,
  router,
  locale,
}) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <link rel="preload" href="/buildwhite.jpg" as="image" />
      <div className="relative overflow-hidden w-full pb-10">
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollPosition * 0.4}px)`,
            transition: "none",
            backgroundImage: "url(/home.png)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-white/70 z-10" />
        <div className="relative z-20 flex flex-col justify-between px-4 text-black">
          <div className="flex flex-col items-center gap-6 mt-16 sm:mt-24 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold max-w-3xl leading-tight">
              {t("title")}
            </h1>
            <p className="text-xl sm:text-2xl">{t("subtitle")}</p>
          </div>

          <div className="w-full flex justify-center pt-24">
            <div className="w-fit border-black border-2 rounded-3xl relative z-40 p-2 bg-white ">
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Piaseczno, Warsaw, ..."
                  className="w-full h-12 px-6 text-lg font-semibold pr-10 text-black placeholder:text-black outline-none"
              
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
                  {Array.from(
                    new Map(
                      fetchProjectsA
                        .filter((project) =>
                          project.city
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((project) => [
                          project.city.toLowerCase(),
                          {
                            city: project.city,
                            country: project.country || "N/A",
                          },
                        ])
                    ).values()
                  ).map(({ city, country }, index) => {
                    const regex = new RegExp(`(${searchTerm})`, "gi");
                    const highlightedText = city.split(regex).map((part, i) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <strong key={i} className="text-red-500">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    );
                    return (
                      <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                        onClick={() => {
                          setSearchTerm(city);
                          localStorage.setItem("selectedCity", city);
                          localStorage.setItem("selectedCountry", country);
                          setTimeout(() => {
                            router.push(`/${locale}/projects`);
                          }, 500);
                        }}
                      >
                        <span>{highlightedText}</span>
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
    </>
  );
} 