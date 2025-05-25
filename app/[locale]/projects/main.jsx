"use client";
import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaEuroSign, FaHeart, FaRegHeart } from "react-icons/fa";
import { TbCurrencyZloty } from "react-icons/tb";
import { ExternalLink, BedDouble, Ruler } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { TailSpin } from "react-loader-spinner";
import Loading from "@/app/[locale]/loading";
import { useTranslations } from "next-intl";
import Gallery from "@/app/[locale]/projects/piclist";
import FilterB from "@/app/[locale]/components/search/FilterB"; // <--- Important !
import { countryData } from "@/utils/cityExisted";

const NEW_FAVORITE_APARTMENTS_KEY = "favoriteApartments";
const ITEMS_PER_PAGE = 12;

const LazyMap = dynamic(() => import("@/app/[locale]/map/index"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <TailSpin color="IndianRed" height={80} width={80} ariaLabel="loading" />
    </div>
  ),
});

function Main() {
  // States principaux
  const [projects, setProjects] = useState([]);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Select a city");
  const [selectedGarden, setSelectedGarden] = useState(false);
  const [selectedSwim, setSelectedSwim] = useState(false);
  const [selectedFitness, setSelectedFitness] = useState(false);
  const [selectedChild, setSelectedChild] = useState(false);
  const [selectedDisabled, setSelectedDisabled] = useState(false);
  const [selectedBike, setSelectedBike] = useState(false);
  const [selectedCctv, setSelectedCctv] = useState(false);
  const [selectedEntrance, setSelectedEntrance] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [surfaceRange, setSurfaceRange] = useState([0, 200]);
  const [bedRange, setBedRange] = useState([0, 10]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("bed");

  const f = useTranslations("Filtre");

  const sort = [
    { key: "surface", label: "surface" },
    { key: "bed", label: "bed" },
  ];

  // Fetch des projets
  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projectlist")
        .select(
          "*, project(*, created_at, city, lat, lng, mainpic_url, swim, fitness, child, disabled, bike, cctv, entrance, country, compagny)"
        )
        .order(sortKey, { ascending: false });
      if (error) setError(error);
      else setOriginalProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, [sortKey]);

  // Récupère favoris
  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem(NEW_FAVORITE_APARTMENTS_KEY)) || [];
    setFavorites(storedFavorites);
  }, []);

  // Si un filtre change, reset page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCountries,
    selectedCity,
    selectedGarden,
    selectedSwim,
    selectedFitness,
    selectedChild,
    selectedDisabled,
    selectedBike,
    selectedCctv,
    selectedEntrance,
    priceRange,
    surfaceRange,
    bedRange,
    showFavorites,
  ]);

  // Gère la logique pays/villes
  useEffect(() => {
    if (selectedCountries.length === 0) {
      setSelectedCity("Select a city");
      return;
    }
    const availableCities = selectedCountries.flatMap(
      (country) => countryData[country] || []
    );
    setSelectedCity((prevCity) =>
      prevCity === "Select a city" || availableCities.includes(prevCity)
        ? prevCity
        : "Select a city"
    );
  }, [selectedCountries]);

  // Filtrage des projets
  const filteredProjects = useMemo(() => {
    let filtered = originalProjects.filter((project) => {
      const { price, surface, bed, garden, project: proj } = project;
      return (
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        surface >= surfaceRange[0] &&
        surface <= surfaceRange[1] &&
        bed >= bedRange[0] &&
        bed <= bedRange[1] &&
        (!selectedGarden || garden === selectedGarden) &&
        (!selectedSwim || proj.swim === selectedSwim) &&
        (!selectedFitness || proj.fitness === selectedFitness) &&
        (!selectedChild || proj.child === selectedChild) &&
        (!selectedDisabled || proj.disabled === selectedDisabled) &&
        (!selectedBike || proj.bike === selectedBike) &&
        (!selectedCctv || proj.cctv === selectedCctv) &&
        (!selectedEntrance || proj.entrance === selectedEntrance) &&
        (selectedCountries.length === 0 ||
          selectedCountries.includes(proj.country)) &&
        (selectedCity === "Select a city" || selectedCity === proj.city) &&
        proj.online === true
      );
    });
    if (showFavorites)
      filtered = filtered.filter((project) => favorites.includes(project.id));
    return filtered;
  }, [
    originalProjects,
    selectedCountries,
    selectedCity,
    priceRange,
    surfaceRange,
    bedRange,
    selectedGarden,
    selectedSwim,
    selectedFitness,
    selectedChild,
    selectedDisabled,
    selectedBike,
    selectedCctv,
    selectedEntrance,
    showFavorites,
    favorites,
  ]);

  // Pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    setProjects(filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  if (loading) return <Loading />;
  if (error) return <div>Error fetching data: {error.message}</div>;

  // Favoris
  const handleToggleFavorite = (item) => {
    const itemId = item.id;
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter((id) => id !== itemId)
      : [...favorites, itemId];
    setFavorites(newFavorites);
    localStorage.setItem(
      NEW_FAVORITE_APARTMENTS_KEY,
      JSON.stringify(newFavorites)
    );
  };
  const isFavorite = (item) => favorites.includes(item.id);

  // Lat/lng extrêmes pour la map
  const getLatLngExtremes = (projects) => {
    const lats = projects.map(({ project }) => project?.lat).filter(Boolean);
    const lngs = projects.map(({ project }) => project?.lng).filter(Boolean);
    const maxLat = Math.max(...lats);
    const minLat = Math.min(...lats);
    const maxLng = Math.max(...lngs);
    const minLng = Math.min(...lngs);
    const mLat = (maxLat + minLat) / 2;
    const mLng = (maxLng + minLng) / 2;
    return { maxLat, minLat, maxLng, minLng, mLat, mLng };
  };
  const latLngExtremes = getLatLngExtremes(filteredProjects);

  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="flex flex-col w-full bg-gray-50 sm:pt-4 mt-12 text-gray-700 mb-16 px-10">
      {/* Barre de filtre */}
      <div className="w-full border-b-1 border-gray-300">
        <FilterB
          selectedCountries={selectedCountries}
          onCountryChange={setSelectedCountries}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedGarden={selectedGarden}
          onGardenChange={setSelectedGarden}
          selectedSwim={selectedSwim}
          onSwimChange={setSelectedSwim}
          selectedFitness={selectedFitness}
          onFitnessChange={setSelectedFitness}
          selectedChild={selectedChild}
          onChildChange={setSelectedChild}
          selectedDisabled={selectedDisabled}
          onDisabledChange={setSelectedDisabled}
          selectedBike={selectedBike}
          onBikeChange={setSelectedBike}
          selectedCctv={selectedCctv}
          onCctvChange={setSelectedCctv}
          selectedEntrance={selectedEntrance}
          onEntranceChange={setSelectedEntrance}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          surfaceRange={surfaceRange}
          onSurfaceRangeChange={setSurfaceRange}
          bedRange={bedRange}
          onBedRangeChange={setBedRange}
          showFavorites={showFavorites}
          onFavoritesChange={setShowFavorites}
          f={f}
        />
      </div>
      {/* Liste + Carte */}
      <div className="w-full flex lg:flex-row flex-col gap-4 lg:justify-between mt-4">
        <div className="lg:w-1/2 flex flex-col">
          {/* Tri et infos */}
          <div className="flex gap-4 items-center justify-center mb-4 px-2 w-full">
            <div className="flex w-full">
              <p className="flex text-xs text-center text-gray-800 w-full">
                Total: {filteredProjects.length} {f("AppartementTrouve")}
              </p>
            </div>
            <div className="flex w-full">
              <label
                className="text-xs mr-2 text-right text-gray-500 w-1/2"
                htmlFor="sort-select"
              >
                {f("TrierPar")} (high to low)
              </label>
              <select
                id="sort-select"
                onChange={(e) => setSortKey(e.target.value)}
                className="bg-white w-[150px] text-gray-500 border border-gray-300 rounded-sm text-xs"
                value={sortKey}
              >
                <option value="" disabled>
                  Select
                </option>
                {sort.map(({ key, label }) => (
                  <option
                    key={key}
                    value={key}
                    className="bg-white text-gray-500"
                  >
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Liste appartements */}
          <ScrollArea className="h-fit w-full px-1 sm:pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ">
              {projects.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow p-2">
                  <div className="flex flex-col w-full px-1">
                    {/* Titre + favori */}
                    <div className="flex items-center justify-between pt-1 w-full h-1/4">
                      <h3 className="font-semibold text-sm truncate">{item.project.name}</h3>
                      <button
                        onClick={() => handleToggleFavorite(item)}
                        className="inline-flex leading-none bg-transparent text-white hover:bg-opacity-10 p-0 m-0"
                        aria-label="favorite"
                        type="button"
                      >
                        {isFavorite(item) ? (
                          <FaHeart fill="#bfae9b" size={15} />
                        ) : (
                          <FaRegHeart fill="#bfae9b" size={15} />
                        )}
                      </button>
                    </div>
                    {/* Ville */}
                    <p className="text-sm text-gray-600 truncate mt-0 mb-1">{item.project.city}</p>
                    {/* Détails */}
                    <div className="flex items-center text-gray-600 gap-4 mt-2 mb-1 text-xs w-full">
                      <div className="w-1/2 flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Ruler className="w-4 h-4" />
                          {item.surface} m²
                        </div>
                        <div className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4" />
                          {item.bed}
                        </div>
                      </div>
                      {item.des && (
                        <div className="flex items-center gap-1 text-rose-700">
                          <p className="text-xs" title={item.des}>
                            {item.des}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Prix, promoteur, lien */}
                    <div className="flex items-center pt-2">
                      <span className="text-gray-600 font-bold text-base">
                        {item.noprice || item.price === null ? (
                          <span className="italic text-gray-500">undefined</span>
                        ) : item.project.cur === "PLN" ? (
                          <span className="flex">
                            {item.price} <TbCurrencyZloty size={15} />
                          </span>
                        ) : (
                          <span className="flex">
                            {item.price} <FaEuroSign size={10} />
                          </span>
                        )}
                      </span>
                      <span className="flex-grow text-gray-500 text-sm text-center truncate">
                        {item.project.compagny}
                      </span>
                      <ExternalLink className="ml-auto w-5 h-5 text-gray-500 hover:text-primary-600 cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-gray-500 px-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="text-gray-500 border bg-white border-gray-400 hover:bg-gray-400 hover:text-white px-3 py-1 rounded"
              >
                {f("precedent")}
              </button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="text-gray-500 border bg-white border-gray-400 hover:bg-gray-400 hover:text-white px-3 py-1 rounded"
              >
                {f("suivant")}
              </button>
            </div>
          </ScrollArea>
        </div>
        {/* Map */}
        <div className="lg:w-1/2">
          <div className="w-full sm:h-[650px] h-[200px] z-0 mb-4">
            <LazyMap
              classN="w-full sm:h-[650px] h-[300px] z-0"
              todos={filteredProjects.map(({ project }) => ({
                lat: project?.lat,
                lng: project?.lng,
                name: project?.name,
                country: project?.country,
                city: project?.city,
                compagny: project?.compagny,
                mainpic_url: project?.mainpic_url,
                link: project?.link,
                codepro: project?.codepro,
              }))}
              maxLat={latLngExtremes.maxLat}
              minLng={latLngExtremes.minLng}
              mLng={latLngExtremes.mLng}
              mLat={latLngExtremes.mLat}
            />
          </div>
        </div>
      </div>
      {/* Derniers projets */}
      <div className="mt-24">
        {selectedCity !== "Select a city" && (
          <p className="text-md md:text-2xl mb-8 pl-4 text-gray-700">
            Les derniers projets à <span className="font-extrabold">{selectedCity}</span>
          </p>
        )}
        <Gallery city={selectedCity} />
      </div>
    </div>
  );
}

export default Main;
