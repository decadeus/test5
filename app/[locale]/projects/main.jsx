"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Checkbox,
  CheckboxGroup,
  Slider,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";

import { createClient } from "@/utils/supabase/client";
import { FaEuroSign, FaHeart, FaRegHeart } from "react-icons/fa";
import { TbCurrencyZloty } from "react-icons/tb";
import { Heart, ExternalLink, MapPin, BedDouble, Ruler } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/app/getimage/project";
import dynamic from "next/dynamic";
import { TailSpin } from "react-loader-spinner";
import { projectIcons } from "@/lib/iconbuilding";
import { countryData } from "@/utils/cityExisted";
import Link from "next/link";
import Loading from "@/app/[locale]/loading";
import { useTranslations } from "next-intl";
import { MdOutput } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import Gallery from "@/app/[locale]/projects/piclist";
import { PiEyeThin } from "react-icons/pi";
import Filter from "@/components/svg/filter";
import generateMetadata from "./metadata";

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
export const metadata = generateMetadata(
  "Page d'accueil",
  "Bienvenue sur notre site !"
);

function ProjectCard({ item, isFavorite, handleToggleFavorite }) {
  return (
    <div className="bg-white rounded-2xl shadow p-2">
      <div className="flex flex-col w-full px-1">
        {/* Image du projet avec cœur superposé */}
        <div className="relative w-full h-40 mb-2 rounded-xl overflow-hidden">
          {item.project.mainpic_url ? (
            <img
              src={item.project.mainpic_url}
              alt={item.project.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full" />
          )}
          <button
            onClick={() => handleToggleFavorite(item)}
            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition"
            aria-label="favorite"
            style={{ zIndex: 2 }}
          >
            {isFavorite(item) ? (
              <FaHeart fill="#bfae9b" size={22} />
            ) : (
              <FaRegHeart fill="#bfae9b" size={22} />
            )}
          </button>
        </div>
        {/* Titre et autres infos */}
        <div className="pt-1 w-full h-1/4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm truncate"> {item.project.name}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 truncate mt-0 mb-1">{item.project.city}</p>
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
              <p className="text-xs" title={item.des}>{item.des}</p>
            </div>
          )}
        </div>
        <div className="flex items-center pt-2">
          <span className="text-gray-600 font-bold text-base">
            {item.noprice || item.price === null ? (
              <span className="italic text-gray-500">undefined</span>
            ) : item.project.cur === "PLN" ? (
              <span className="flex">{item.price} <TbCurrencyZloty size={15} /></span>
            ) : (
              <span className="flex">{item.price} <FaEuroSign size={10} /></span>
            )}
          </span>
          <span className="flex-grow text-gray-500 text-sm text-center truncate">{item.project.compagny}</span>
          <ExternalLink className="ml-auto w-5 h-5 text-gray-500 hover:text-primary-600 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

function Main() {
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const sort = [
    { key: "surface", label: "surface" },
    { key: "bed", label: "bed" },
  ];

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .select(
        "*, project(*, created_at, city, lat, lng, mainpic_url, swim, fitness, child, disabled, bike, cctv, entrance, country, compagny)"
      )
      .order(sortKey, { ascending: false });
    if (error) {
      setError(error);
    } else {
      setOriginalProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [sortKey]);

  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem(NEW_FAVORITE_APARTMENTS_KEY)) || [];
    setFavorites(storedFavorites);
  }, []);

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

  useEffect(() => {
    if (selectedCountries.length === 0) {
      setSelectedCity("Select a city");
      return;
    }

    const availableCities = selectedCountries.flatMap(
      (country) => countryData[country] || []
    );

    // Réinitialiser les villes sélectionnées si la valeur actuelle n'est pas dans les nouvelles villes disponibles
    setSelectedCity((prevCity) =>
      prevCity === "Select a city" || availableCities.includes(prevCity)
        ? prevCity
        : "Select a city"
    );
  }, [selectedCountries]);

  const filteredProjects = useMemo(() => {
    let filtered = originalProjects.filter((project) => {
      const isInPriceRange =
        project.price >= priceRange[0] && project.price <= priceRange[1];
      const isInSurfaceRange =
        project.surface >= surfaceRange[0] &&
        project.surface <= surfaceRange[1];
      const isInBedRange =
        project.bed >= bedRange[0] && project.bed <= bedRange[1];
      const hasGarden = !selectedGarden || project.garden === selectedGarden;
      const hasSwim = !selectedSwim || project.project.swim === selectedSwim;
      const hasFitness =
        !selectedFitness || project.project.fitness === selectedFitness;
      const hasChild =
        !selectedChild || project.project.child === selectedChild;
      const hasDisabled =
        !selectedDisabled || project.project.disabled === selectedDisabled;
      const hasBike = !selectedBike || project.project.bike === selectedBike;
      const hasCctv = !selectedCctv || project.project.cctv === selectedCctv;
      const hasEntrance =
        !selectedEntrance || project.project.entrance === selectedEntrance;

      // New Filters for country and city
      const isInCountry =
        selectedCountries.length === 0 ||
        selectedCountries.includes(project.project.country);

      const isInCity =
        selectedCity === "Select a city" ||
        selectedCity === project.project.city;

      return (
        isInPriceRange &&
        isInSurfaceRange &&
        isInBedRange &&
        hasGarden &&
        hasSwim &&
        hasFitness &&
        hasChild &&
        hasDisabled &&
        hasBike &&
        hasCctv &&
        hasEntrance &&
        isInCountry &&
        isInCity &&
        project.project.online === true
      );
    });

    if (showFavorites) {
      filtered = filtered.filter((project) => favorites.includes(project.id));
    }

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

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setProjects(filteredProjects.slice(startIndex, endIndex));
  }, [filteredProjects, currentPage]);

  const handleCountryChange = (selected) => {
    setSelectedCountries(selected);
    // Réinitialiser la sélection des villes lors de la sélection d'un pays
    setSelectedCity("Select a city");
  };

  // Fonction pour changer la sélection des villes
  const handleCityChange = (selected) => {
    setSelectedCity(selected);
  };

  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
  };

  const handleSurfaceRangeChange = (values) => {
    setSurfaceRange(values);
  };

  const handleBedRangeChange = (values) => {
    setBedRange(values);
  };

  const handleGardenChange = (values) => {
    setSelectedGarden(values);
  };

  const handleSwimChange = (selected) => {
    setSelectedSwim(selected.includes("swim"));
  };

  const handleFitnessChange = (selected) => {
    setSelectedFitness(selected.includes("fitness"));
  };

  const handleChildChange = (selected) => {
    setSelectedChild(selected.includes("child"));
  };

  const handleDisabledChange = (selected) => {
    setSelectedDisabled(selected.includes("disabled"));
  };

  const handleBikeChange = (selected) => {
    setSelectedBike(selected.includes("bike"));
  };

  const handleCctvChange = (selected) => {
    setSelectedCctv(selected.includes("cctv"));
  };

  const handleEntranceChange = (selected) => {
    setSelectedEntrance(selected.includes("entrance"));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

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

  const getLatLngExtremes = (projects) => {
    const lats = projects
      .map(({ project }) => project?.lat)
      .filter((lat) => lat !== null && lat !== undefined);
    const lngs = projects
      .map(({ project }) => project?.lng)
      .filter((lng) => lng !== null && lng !== undefined);

    const maxLat = Math.max(...lats);
    const minLat = Math.min(...lats);
    const maxLng = Math.max(...lngs);
    const minLng = Math.min(...lngs);

    // Calcul de la moyenne des latitudes et longitudes
    const mLat = (maxLat + minLat) / 2;
    const mLng = (maxLng + minLng) / 2;

    // Retourner toutes les valeurs
    return { maxLat, minLat, maxLng, minLng, mLat, mLng };
  };
  const latLngExtremes = getLatLngExtremes(filteredProjects);

  return (
    <div className="flex flex-col w-full bg-gray-50 sm:pt-4 mt-12 text-gray-700 mb-16 px-10">
      <div className="w-full border-b-1 border-gray-300">
        <FilterB
          selectedCountries={selectedCountries}
          onCountryChange={handleCountryChange}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          selectedGarden={selectedGarden}
          onGardenChange={handleGardenChange}
          selectedSwim={selectedSwim}
          onSwimChange={handleSwimChange}
          selectedFitness={selectedFitness}
          onFitnessChange={handleFitnessChange}
          selectedChild={selectedChild}
          onChildChange={handleChildChange}
          selectedDisabled={selectedDisabled}
          onDisabledChange={handleDisabledChange}
          selectedBike={selectedBike}
          onBikeChange={handleBikeChange}
          selectedCctv={selectedCctv}
          onCctvChange={handleCctvChange}
          selectedEntrance={selectedEntrance}
          onEntranceChange={handleEntranceChange}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          surfaceRange={surfaceRange}
          onSurfaceRangeChange={handleSurfaceRangeChange}
          bedRange={bedRange}
          onBedRangeChange={handleBedRangeChange}
          showFavorites={showFavorites}
          onFavoritesChange={setShowFavorites}
          f={f}
        />
      </div>
      <div className=" w-full flex lg:flex-row flex-col gap-4 lg:justify-between mt-4">
        <div className="lg:w-1/2 flex flex-col">
          <div className="">
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
                >
                  <option value="" disabled selected>
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
          </div>
          <div className="">
            <ScrollArea className="h-fit w-full px-1 sm:pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ">
                {projects.map((item, index) => (
                  <ProjectCard
                    key={index}
                    item={item}
                    isFavorite={isFavorite}
                    handleToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 text-gray-500 px-4">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="text-gray-500 border bg-white border-gray-400 hover:bg-gray-400 hover:text-white"
                >
                  {f("precedent")}
                </Button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="text-gray-500 border bg-white border-gray-400 hover:bg-gray-400 hover:text-white"
                >
                  {f("suivant")}
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="lg:w-1/2  ">
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
              maxLat={latLngExtremes.maxLat} // Passer maxLat
              minLng={latLngExtremes.minLng}
              mLng={latLngExtremes.mLng}
              mLat={latLngExtremes.mLat} // Passer minLng
            />
          </div>
        </div>
      </div>
      <div className="mt-24">
        {selectedCity !== "Select a city" && (
          <p className="text-md md:text-2xl mb-8 pl-4 text-gray-700">
            Les derniers projets à{" "}
            <span className="font-extrabold">{selectedCity}</span>
          </p>
        )}

        <Gallery city={selectedCity} />
      </div>
    </div>
  );
}

export default Main;

function FilterB({
  selectedCountries,
  onCountryChange,
  selectedCity,
  onCityChange,
  selectedGarden,
  onGardenChange,
  selectedSwim,
  onSwimChange,
  selectedFitness,
  onFitnessChange,
  selectedChild,
  onChildChange,
  selectedDisabled,
  onDisabledChange,
  selectedBike,
  onBikeChange,
  selectedCctv,
  onCctvChange,
  selectedEntrance,
  onEntranceChange,
  priceRange,
  onPriceRangeChange,
  surfaceRange,
  onSurfaceRangeChange,
  bedRange,
  onBedRangeChange,
  showFavorites,
  onFavoritesChange,
  f,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSurfaceModalOpen, setIsSurfaceModalOpen] = useState(false);
  const [isBedsModalOpen, setIsBedsModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [editableCountry, setEditableCountry] = useState("");
  const [editableCity, setEditableCity] = useState("Select city");
  const [countryData, setCountryData] = useState({});

  const colorfilter = "text-sm  text-gray-800";

  useEffect(() => {
    async function fetchCountries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project")
        .select("country, city");

      if (error) {
        return;
      }

      // 🔹 Transform data into { country: [cities] } format
      const formattedData = data.reduce((acc, { country, city }) => {
        if (!acc[country]) acc[country] = [];
        if (!acc[country].includes(city)) acc[country].push(city);
        return acc;
      }, {});

      setCountryData(formattedData);
    }

    fetchCountries();
  }, []);

  useEffect(() => {
    // Récupération des données depuis localStorage
    const storedCountry = localStorage.getItem("selectedCountry") || "";
    const storedCity = localStorage.getItem("selectedCity") || "";
    if (storedCity) {
      setEditableCity(storedCity);
      onCityChange(storedCity);
    }

    // Vérifie si les données du pays ont été chargées avant de définir la ville
    if (Object.keys(countryData).length > 0) {
      setEditableCountry(storedCountry);
      onCountryChange([storedCountry]); // Met à jour le state du parent

      if (storedCountry && countryData[storedCountry]) {
        const availableCities = countryData[storedCountry];
        setCities(availableCities);

        const defaultCity = availableCities.includes(storedCity)
          ? storedCity
          : availableCities.length > 0
          ? availableCities[0]
          : "";

        setEditableCity(defaultCity);
        onCityChange(defaultCity); // Met à jour la ville sélectionnée
      }
    }
  }, [countryData]);
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setEditableCountry(selectedCountry);
    onCountryChange([selectedCountry]);
    localStorage.setItem("selectedCountry", selectedCountry); // Sauvegarde dans localStorage

    // 🔹 Mettre à jour la liste des villes avec "Select city" comme première option
    if (selectedCountry && countryData[selectedCountry]) {
      const availableCities = ["Select city", ...countryData[selectedCountry]];
      setCities(availableCities);

      // 🔹 Sélectionner par défaut "Select city"
      setEditableCity("Select city");
      onCityChange("Select city");
      localStorage.setItem("selectedCity", "Select city"); // Sauvegarde l'option par défaut
    } else {
      setCities(["Select city"]);
      setEditableCity("Select city");
      onCityChange("Select city");
      localStorage.setItem("selectedCity", "Select city"); // Réinitialiser si aucun pays valide
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setEditableCity(selectedCity);
    onCityChange(selectedCity);
    localStorage.setItem("selectedCity", selectedCity); // Sauvegarde dans localStorage
  };

  const facilities = [
    {
      id: "swim",
      label: "Swimming pool",
      value: "swim",
      selected: selectedSwim,
      onChange: onSwimChange,
    },
    {
      id: "fitness",
      label: "Fitness room",
      value: "fitness",
      selected: selectedFitness,
      onChange: onFitnessChange,
    },
    {
      id: "child",
      label: "Children's playground",
      value: "child",
      selected: selectedChild,
      onChange: onChildChange,
    },
    {
      id: "disabled",
      label: "Adapted for disabled people",
      value: "disabled",
      selected: selectedDisabled,
      onChange: onDisabledChange,
    },
    {
      id: "bike",
      label: "Bicycle parking",
      value: "bike",
      selected: selectedBike,
      onChange: onBikeChange,
    },
    {
      id: "cctv",
      label: "CCTV",
      value: "cctv",
      selected: selectedCctv,
      onChange: onCctvChange,
    },
    {
      id: "entrance",
      label: "Entrance with reception",
      value: "entrance",
      selected: selectedEntrance,
      onChange: onEntranceChange,
    },
  ];

  const countChecked = () =>
    facilities.filter((facility) => facility.selected).length;

  const modalData = [
    {
      label: f("Prix"),
      range: priceRange,
      onRangeChange: onPriceRangeChange,
      min: 0,
      max: 1000000,
      step: 1,
      isOpen: isPriceModalOpen,
      setIsOpen: setIsPriceModalOpen,
      id: "price-modal",
    },
    {
      label: f("Surface"),
      range: surfaceRange,
      onRangeChange: onSurfaceRangeChange,
      min: 0,
      max: 200,
      step: 1,
      isOpen: isSurfaceModalOpen,
      setIsOpen: setIsSurfaceModalOpen,
      id: "surface-modal",
    },
    {
      label: f("Chambres"),
      range: bedRange,
      onRangeChange: onBedRangeChange,
      min: 0,
      max: 10,
      step: 1,
      isOpen: isBedsModalOpen,
      setIsOpen: setIsBedsModalOpen,
      id: "beds-modal",
    },
  ];

  const handleIconClick = () => {
    onFavoritesChange(!showFavorites);
  };
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <button
        onClick={() => onFavoritesChange(!showFavorites)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold transition-colors duration-200 text-sm ${showFavorites ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-600 hover:bg-green-50'}`}
        aria-pressed={showFavorites}
      >
        {showFavorites ? <FaHeart /> : <FaRegHeart />}
        {showFavorites ? f('Voir tous les projets') : f('Afficher mes favoris')}
      </button>
      <div className="hidden lg:block  py-4 w-full">
        <div className="flex justify-between">
          <div className="flex gap-2  w-1/2">
            <div className="">
              <select
                value={editableCountry}
                onChange={handleCountryChange}
                className="w-[100px] border-gray-300 border-1 rounded-2xl text-sm px-2 py-2 "
              >
                <option value="" className="text-red-300 ">
                  {f("SelectionnezUnPays")}
                </option>
                {Object.keys(countryData).map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <select
                value={editableCity}
                onChange={handleCityChange}
                className="w-[150px] bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-2 "
              >
                {cities.map((city, index) => (
                  <option key={index} value={city} className="text-black">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <div className="w-fit bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-2 ">
                <Checkbox
                  isChecked={selectedGarden}
                  onChange={(e) => onGardenChange(e.target.checked)}
                  aria-label="Garden"
                  size="sm"
                  radius="full"
                  className="flex justify-center items-center"
                  color="success"
                >
                  <p className={colorfilter}>{f("AvecJardin")}</p>
                </Checkbox>
              </div>
            </div>
            <div className="w-fit bg-white border border-gray-300 border-1 rounded-2xl text-sm px-2 py-2 flex items-center cursor-pointer ml-2"
                 onClick={() => onFavoritesChange(!showFavorites)}
                 aria-label="favorite">
              <span className="pr-2 text-sm text-gray-800">Mes favoris</span>
              {showFavorites ? (
                <FaHeart size={20} color="#bfae9b" />
              ) : (
                <FaRegHeart size={20} color="#bfae9b" />
              )}
            </div>
            <div className="">
              <Button
                onClick={() => onOpenChange(true)}
                variant="light"
                radius="none"
                className="w-fit bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-3  "
                id="equip"
              >
                <p className="text-left text-sm flex items-center text-gray-800">
                  {f("Residence")}
                </p>
                <p>
                  {" "}
                  <Filter className="w-8 h-8" />
                </p>
              </Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <div className="flex flex-col gap-2 p-4">
                      {facilities.map(
                        ({ id, label, value, selected, onChange }) => (
                          <CheckboxGroup
                            key={id}
                            id={id}
                            value={selected ? [value] : []}
                            onChange={onChange}
                            color="bgmap"
                            orientation="horizontal"
                            aria-label={label}
                          >
                            <Checkbox value={value}>
                              <div className="flex items-center">
                                <p className="mr-2">{label}</p>
                              </div>
                            </Checkbox>
                          </CheckboxGroup>
                        )
                      )}
                    </div>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>

          <div className=" flex justify-end items-end w-1/2">
            <div className="flex flex-col gap-2 w-full ">
              <div className="flex w-full justify-center items-end ">
                <div className="flex w-3/4  gap-3">
                  {modalData.map(
                    ({ label, range, onRangeChange, min, max, step, id }) => (
                      <div key={id} className="w-full">
                        <div className="flex justify-between text-xs pb-1">
                          <p className={colorfilter}>{label}</p>
                          <p className={colorfilter}>
                            {range[0]} - {range[1]}
                          </p>
                        </div>
                        <div className="">
                          <Slider
                            min={min}
                            maxValue={max}
                            step={step}
                            value={range}
                            onChange={onRangeChange}
                            classNames={{
                              base: "max-w-md gap-3 h-[2px]",
                              track: "border-s-brownd h-[2px] bg-white ",
                              filler:
                                "bg-gradient-to-r from-custom-brownc to-custom-brownd",
                            }}
                            renderThumb={(props) => (
                              <div
                                {...props}
                                className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-xl rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                              >
                                <span className="transition-transform bg-gradient-to-br shadow-2xl from-custom-brownc to-custom-brownd rounded-full w-1 h-1 block group-data-[dragging=true]:scale-80 " />
                              </div>
                            )}
                            aria-label={label}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden py-4 ">
        <div className="flex justify-between items-center px-4 ">
          <div className="flex justify-center items-center pl-5">
            <div
              onClick={() => onFavoritesChange(!showFavorites)}
              className={`cursor-pointer flex items-center ${showFavorites ? "text-gray-500" : "text-gray-600"}`}
              aria-label="favorite"
            >
              {showFavorites ? (
                <FaHeart size={20} color="#bfae9b" />
              ) : (
                <FaRegHeart size={20} color="#bfae9b" />
              )}
              <p className="pl-4">{f("MesFavoris")}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onPress={onOpen}
              className="flex justify-center items-center"
            >
              {f("Filtre")}
            </Button>
          </div>
        </div>
        {/* modal  */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="flex flex-col gap-6 pt-10">
                    {/* Country and City Selectors */}
                    <div className="flex justify-center gap-6">
                      <select
                        value={editableCountry}
                        onChange={handleCountryChange}
                        className="border border-gray-300 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm w-36"
                      >
                        <option value="" className="text-red-300 text-sm">
                          {f("SelectionnezUnPays")}
                        </option>
                        {Object.keys(countryData).map((country) => (
                          <option
                            key={country}
                            value={country}
                            className="text-black text-sm"
                          >
                            {country}
                          </option>
                        ))}
                      </select>

                      <select
                        value={editableCity}
                        onChange={handleCityChange}
                        className="border border-gray-300 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm w-36"
                      >
                        <option value="" className="text-red-300 text-sm">
                          {f("SelectionnezUneVille")}
                        </option>
                        {cities.map((city, index) => (
                          <option
                            key={index}
                            value={city}
                            className="text-black text-sm"
                          >
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Facilities Section */}
                    <div className="flex flex-col gap-4">
                      {facilities.map(
                        ({ id, label, value, selected, onChange }) => (
                          <CheckboxGroup
                            key={id}
                            id={id}
                            value={selected ? [value] : []}
                            onChange={onChange}
                            color="bgmap"
                            orientation="horizontal"
                            aria-label={label}
                          >
                            <Checkbox value={value}>
                              <div className="flex items-center">
                                <p className="text-sm">{label}</p>
                              </div>
                            </Checkbox>
                          </CheckboxGroup>
                        )
                      )}
                    </div>

                    {/* Sliders Section */}
                    <div className="flex flex-col gap-14">
                      {modalData.map(
                        ({
                          label,
                          range,
                          onRangeChange,
                          min,
                          max,
                          step,
                          id,
                        }) => (
                          <div key={id} className="w-full">
                            <div className="flex justify-between text-sm pb-1">
                              <p className={`${colorfilter} text-sm`}>
                                {label}
                              </p>
                              <p className={`${colorfilter} text-sm`}>
                                {range[0]} - {range[1]}
                              </p>
                            </div>
                            <Slider
                              min={min}
                              maxValue={max}
                              step={step}
                              value={range}
                              onChange={onRangeChange}
                              classNames={{
                                base: "max-w-md gap-3 h-[2px]",
                                track: "h-[2px] bg-gray-300",
                                filler:
                                  "bg-gradient-to-r from-custom-brownc to-custom-brownd",
                              }}
                              renderThumb={(props) => (
                                <div
                                  {...props}
                                  className="p-1 bg-background border rounded-full shadow-lg cursor-grab"
                                >
                                  <span className="block w-1 h-1 bg-gradient-to-br from-custom-brownc to-custom-brownd rounded-full" />
                                </div>
                              )}
                              aria-label={label}
                            />
                          </div>
                        )
                      )}
                    </div>

                    {/* Garden Option */}
                    <div className="flex justify-center pt-4">
                      <div className="w-fit bg-white border border-gray-300 rounded-2xl px-4 py-2">
                        <Checkbox
                          isChecked={selectedGarden}
                          onChange={(e) => onGardenChange(e.target.checked)}
                          color="bgmap"
                          size="sm"
                          radius="full"
                        >
                          <p className={`${colorfilter} text-sm`}>
                            {f("AvecJardin")}
                          </p>
                        </Checkbox>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
