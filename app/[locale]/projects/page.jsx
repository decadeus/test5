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
} from "@nextui-org/react";

import { createClient } from "@/utils/supabase/client";
import { FaEuroSign, FaHeart, FaRegHeart } from "react-icons/fa";
import { TbCurrencyZloty } from "react-icons/tb";

import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/app/getimage/project";
import dynamic from "next/dynamic";
import { TailSpin } from "react-loader-spinner";
import { projectIcons } from "@/lib/iconbuilding";
import { countryData } from "@/utils/countryData";
import Link from "next/link";
import Loading from "@/app/[locale]/loading";
import { useTranslations } from "next-intl";
import { MdOutput } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import Gallery from "@/app/[locale]/projects/piclist";
import { PiEyeThin } from "react-icons/pi";

const NEW_FAVORITE_APARTMENTS_KEY = "favoriteApartments";
const ITEMS_PER_PAGE = 8;

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
function ProjectIconsDisplay({ project }) {
  return (
    <div className="flex gap-2">
      {projectIcons.map(
        ({ key, icon: Icon }) => project[key] && <Icon key={key} />
      )}
    </div>
  );
}

function Page() {
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

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .select(
        "*, project(*, created_at, city, lat, lng, mainpic_url, swim, fitness, child, disabled, bike, cctv, entrance)"
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
        isInCity
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

  const handleSortChange = (key) => {
    setSortKey(key);
  };

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

  const handleGardenChange = (selected) => {
    setSelectedGarden(selected.includes("garden"));
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
    <div className="flex flex-col w-full gap-4 sm:pt-4 mt-32 bgfull text-black mb-16">
      <h1 className="text-5xl colortest  font-satisfy pl-4">
        {f("ListeDesAppartements")}
      </h1>
      <div className="pl-4">
        <div className="flex  w-full my-8 ">
          <Link
            href="/projects"
            className="border-2 brownborder p-2 w-fit clearbg browntext rounded hover:bg-[#c9af95] hover:text-[#f6f6f4] hover:border-black transition-all duration-500 mx-8"
          >
            {f("Ajouter")}
          </Link>
        </div>
      </div>
    
      {/* // plan B */}
      <div className=" w-full flex ">
        <div className="w-1/2 flex flex-col">
          <div className="">
            <div className="flex justify-between items-center mb-4 px-2">
              <p className="flex text-xs text-center text-gray-500 w-full">
                Total: {filteredProjects.length} {f("AppartementTrouve")}
              </p>
              <div className="flex sm:flex-row flex-col sm:items-center items-end sm:w-full w-1/2">
                <label
                  className="text-xs mr-2 w-[300px] text-right text-gray-500"
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
            <div className="w-full px-2">
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
          </div>
          <div className="">
            <ScrollArea className="h-fit w-full px-2 sm:pb-4">
              <div className="relative flex flex-col w-full sm:gap-2 gap-4 justify-center">
                {projects.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center w-full gap-4 bg-gray-100 shadow-sm rounded-sm group"
                  >
                    <div className="flex flex-col w-full gap-4 justify-center py-2 px-2 ">
                      <div className=" transition duration-300">
                        {/* Le div principal qui subit le flou */}
                        <div className="">
                          <div className="flex  w-full ">
                            <div className="flex justify-between w-full">
                              <div className=" flex flex-col justify-between  text-gray-500">
                                <div className="flex gap-2 text-xs text-gray-500">
                                  <div className="flex gap-2">
                                    <div>
                                      <p>{item.surface} m²</p>
                                    </div>
                                    <div>
                                      <p>{item.bed} beds</p>
                                    </div>
                                  </div>
                                  <div className="">
                                    {item.noprice || item.price === null ? (
                                      <p className="flex gap-1 items-center italic text-xs">
                                        undefined
                                      </p>
                                    ) : (
                                      <p className="flex gap-1 items-center font-bold text-xs">
                                        {item.project.currency === "PLN" ? (
                                          <span className="flex items-center">
                                            {item.price}
                                            <TbCurrencyZloty size={15} />
                                          </span>
                                        ) : (
                                          <span className="flex items-center">
                                            {item.price}{" "}
                                            <FaEuroSign size={13} />
                                          </span>
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 text-xs text-gray-500 ">
                                  <p className="text-md font-bold">
                                    {item.project.name}
                                  </p>
                                  <p className="font-semibold">
                                    {item.project.country}
                                  </p>
                                  <p>{item.project.city}</p>
                                </div>
                              </div>
                              <div className="flex justify-center items-center">
                                {" "}
                                {item.des && (
                                  <div className="">
                                    <p className=" bg-white  rounded-lg text-gray-700  px-2 py-1 text-xs">
                                      {item.des}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className=" justify-center items-center flex pr-4 ">
                                <div>
                                  <Tooltip
                                    content={
                                      <div className=" h-[150px] w-[250px] p-0 m-0 rounded-xl">
                                        <Avatar
                                          url={item.project.mainpic_url} // Utilise 'src' au lieu de 'url'
                                          width={250} // Ajuste la largeur pour correspondre à la taille du div parent
                                          height={150} // Ajuste la hauteur pour correspondre à la taille du div parent
                                          className="rounded-xl p-0 m-0" // Supprime l'arrondi
                                        />
                                      </div>
                                    }
                                    radius="none" // Ajuste le rayon du tooltip
                                    color="transparent" // Supprime la couleur de fond par défaut
                                    borderWeight="none"
                                    containerPadding={0} // Supprime la bordure
                                    shadow="lg" // Supprime l'ombre
                                  >
                                    <p>
                                      <PiEyeThin size={20} />
                                    </p>
                                  </Tooltip>
                                </div>
                                <div className="flex justify-center items-center">
                                  <Button
                                    onClick={() => handleToggleFavorite(item)}
                                    className="bg-transparent text-white hover:bg-opacity-10"
                                    aria-label="favorite"
                                  >
                                    {isFavorite(item) ? (
                                      <FaHeart fill="#bfae9b" size={15} />
                                    ) : (
                                      <FaRegHeart fill="#bfae9b" size={15} />
                                    )}
                                  </Button>
                                </div>
                                <div>
                                  <IoIosLogOut size={16} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
        <div className="w-1/2  ">
          <div className="w-full sm:h-[650px] h-[200px] z-0 mb-4">
            <LazyMap
              classN="w-full sm:h-[650px] h-[200px] z-0"
              todos={filteredProjects.map(({ project }) => ({
                lat: project?.lat,
                lng: project?.lng,
                name: project?.name,
                country: project?.country,
                city: project?.city,
                compagny: project?.compagny,
                mainpic_url: project?.mainpic_url,
                link: project?.link,
              }))}
              maxLat={latLngExtremes.maxLat} // Passer maxLat
              minLng={latLngExtremes.minLng}
              mLng={latLngExtremes.mLng}
              mLat={latLngExtremes.mLat} // Passer minLng
            />
          </div>
        </div>
      
      </div>
     <Gallery />
   
    </div>
  );
}

export default Page;

function Filter({
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

  // State for Country and City
  const [cities, setCities] = useState([]);
  const [editableCountry, setEditableCountry] = useState("");
  const [editableCity, setEditableCity] = useState("Select a city");

  const colorfilter = "text-gray-400 text-xs";

  // Handle country change and reset the city selection to "Select a city"
  useEffect(() => {
    if (editableCountry && countryData[editableCountry]) {
      setCities(countryData[editableCountry]);
      setEditableCity("Select a city");
    } else {
      setCities([]);
      setEditableCity("Select a city");
    }
  }, [editableCountry]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setEditableCountry(selectedCountry);
    onCountryChange([selectedCountry]); // Assuming single country selection
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setEditableCity(selectedCity);
    onCityChange(selectedCity);
  };

  // Facilities data
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

  // Count the number of checked items
  const countChecked = () =>
    facilities.filter((facility) => facility.selected).length;

  const modalData = [
    {
      label: f("Prix"),
      range: priceRange,
      onRangeChange: onPriceRangeChange,
      min: 0,
      max: 2000000,
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

  return (
    <div>
      <div className="hidden lg:block">
        <div className=" flex items-center w-full pl-4 ">
          <div className="flex md:flex-row sm:flex-col  justify-center items-center w-3/12 gap-2">
            <div className="flex flex-col w-1/2">
              <select
                value={editableCountry}
                onChange={handleCountryChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 text-xs"
              >
                <option value="" className="text-red-300">
                  {f("SelectionnezUnPays")}
                </option>
                {Object.keys(countryData).map((country) => (
                  <option key={country} value={country} className="text-black">
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-1/2">
              <select
                value={editableCity}
                onChange={handleCityChange}
                className="border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 text-xs"
              >
                <option value="Select a city" className="text-red-300">
                  {f("SelectionnezUneVille")}
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city} className="text-black">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center w-9/12 gap-2 ">
            <div className="flex md:flex-row sm:flex-col pr-2 gap-2 ">
              <div className="bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
                <Checkbox
                  isChecked={showFavorites}
                  onChange={(e) => onFavoritesChange(e.target.checked)}
                  color="bgmap"
                  aria-label="favorite"
                  size="sm"
                >
                  <p className={colorfilter}>{f("MesFavoris")}</p>
                </Checkbox>
              </div>
              <div className="bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
                <Checkbox
                  isChecked={selectedGarden}
                  onChange={(e) => onGardenChange(e.target.checked)}
                  color="bgmap"
                  aria-label="Garden"
                  size="sm"
                >
                  <p className={colorfilter}>{f("AvecJardin")}</p>
                </Checkbox>
              </div>
            </div>

            <div className="flex gap-2 py-2 sm:flex-wrap ">
              {modalData.map(
                ({
                  label,
                  range,
                  onRangeChange,
                  min,
                  max,
                  step,
                  isOpen,
                  setIsOpen,
                  id,
                }) => (
                  <div key={id}>
                    <Button
                      onClick={() => setIsOpen(true)}
                      variant="light"
                      radius="none"
                      className="px-0"
                    >
                      <div className="flex gap-1 bg-white border-gray-300 border-1 rounded-sm text-xs px-2 py-2">
                        <p className={colorfilter}>{label}</p>
                        <p className={colorfilter}>
                          ({range[0]} - {range[1]})
                        </p>
                      </div>
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={setIsOpen} id={id}>
                      <ModalContent>
                        {(onClose) => (
                          <div>
                            <div className="w-full flex gap-4 pb-4">
                              <div className="border-2 border-black rounded-sm w-1/2 p-2">
                                <p className="font-semibold text-sm">Min</p>
                                <p>{range[0]}</p>
                              </div>
                              <div className="border-2 border-black rounded-sm w-1/2 p-2">
                                <p className="font-semibold text-sm">Max</p>
                                <p>{range[1]}</p>
                              </div>
                            </div>
                            <Slider
                              min={min}
                              max={max}
                              step={step}
                              value={range}
                              onChange={onRangeChange}
                              className="max-w-md"
                              color="bgmap"
                              aria-label={label}
                              size="sm"
                            />
                          </div>
                        )}
                      </ModalContent>
                    </Modal>
                  </div>
                )
              )}
            </div>
            <div className="flex gap-2 ">
              <div>
                <Button
                  onClick={() => onOpenChange(true)}
                  variant="light"
                  radius="none"
                  className="px-0"
                >
                  <div className="flex  bg-white border-gray-300 border-1 rounded-sm text-xs px-2 py-2">
                    <p className={colorfilter}>
                      {f("Residence")}({countChecked()})
                    </p>
                  </div>
                </Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <div className="flex flex-col gap-2">
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
                                  <span className="text-xs text-gray-500">
                                    ({countChecked([selected])})
                                  </span>
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
          </div>
        </div>
      </div>
      <div className="lg:hidden block">
        <div className="w-full flex justify-center">
          <Button
            onPress={onOpen}
            className="mb-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 w-fit"
          >
            Filtre
          </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="bg-gray-50 p-6 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-col w-full">
                    {/* Container for the select inputs */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                      {/* Country Select */}
                      <div className="w-full md:w-1/2">
                        <select
                          value={editableCountry}
                          onChange={handleCountryChange}
                          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-sm w-full shadow-sm hover:shadow-md transition duration-150"
                        >
                          <option value="" className="text-red-300">
                            {f("SelectionnezUnPays")}
                          </option>
                          {Object.keys(countryData).map((country) => (
                            <option
                              key={country}
                              value={country}
                              className="text-black"
                            >
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* City Select */}
                      <div className="w-full md:w-1/2">
                        <select
                          value={editableCity}
                          onChange={handleCityChange}
                          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-sm w-full shadow-sm hover:shadow-md transition duration-150"
                        >
                          <option
                            value="Select a city"
                            className="text-red-300"
                          >
                            {f("SelectionnezUneVille")}
                          </option>
                          {cities.map((city, index) => (
                            <option
                              key={index}
                              value={city}
                              className="text-black"
                            >
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Checkboxes for filtering options */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                      <div className="flex items-center">
                        <Checkbox
                          isChecked={showFavorites}
                          onChange={(e) => onFavoritesChange(e.target.checked)}
                          color="bgmap"
                          aria-label="favorite"
                          size="sm"
                        >
                          <span className="ml-2 text-gray-600">
                            {f("MesFavoris")}
                          </span>
                        </Checkbox>
                      </div>

                      <div className="flex items-center">
                        <Checkbox
                          isChecked={selectedGarden}
                          onChange={(e) => onGardenChange(e.target.checked)}
                          color="bgmap"
                          aria-label="Garden"
                          size="sm"
                        >
                          <span className="ml-2 text-gray-600">
                            {f("AvecJardin")}
                          </span>
                        </Checkbox>
                      </div>
                    </div>

                    {/* Slider modals */}
                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      {modalData.map(
                        ({
                          label,
                          range,
                          onRangeChange,
                          min,
                          max,
                          step,
                          isOpen,
                          setIsOpen,
                          id,
                        }) => (
                          <div
                            key={id}
                            className="flex flex-col w-full md:w-1/3"
                          >
                            <Button
                              onClick={() => setIsOpen(true)}
                              variant="light"
                              radius="none"
                              className="bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150"
                            >
                              <div className="flex justify-between">
                                <p className="text-gray-700">{label}</p>
                                <p className="text-gray-500">
                                  ({range[0]} - {range[1]})
                                </p>
                              </div>
                            </Button>
                            <Modal
                              isOpen={isOpen}
                              onOpenChange={setIsOpen}
                              id={id}
                            >
                              <ModalContent>
                                {(onClose) => (
                                  <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg">
                                    <h3 className="font-semibold text-lg mb-4">
                                      {label}
                                    </h3>
                                    <div className="flex justify-between mb-2">
                                      <div className="border-2 border-gray-300 rounded-md w-1/2 p-2 bg-gray-100">
                                        <p className="font-semibold text-sm">
                                          Min
                                        </p>
                                        <p>{range[0]}</p>
                                      </div>
                                      <div className="border-2 border-gray-300 rounded-md w-1/2 p-2 bg-gray-100">
                                        <p className="font-semibold text-sm">
                                          Max
                                        </p>
                                        <p>{range[1]}</p>
                                      </div>
                                    </div>
                                    <Slider
                                      min={min}
                                      max={max}
                                      step={step}
                                      value={range}
                                      onChange={onRangeChange}
                                      className="max-w-md mt-4"
                                      color="bgmap"
                                      aria-label={label}
                                      size="sm"
                                    />
                                  </div>
                                )}
                              </ModalContent>
                            </Modal>
                          </div>
                        )
                      )}
                    </div>

                    {/* Directly display the list of checkboxes for residence */}
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-lg mb-2">Résidences</h3>
                      {facilities.map(
                        ({ id, label, value, selected, onChange }) => (
                          <CheckboxGroup
                            key={id}
                            id={id}
                            value={selected ? [value] : []}
                            onChange={onChange}
                            color="bgmap"
                            orientation="vertical"
                            aria-label={label}
                          >
                            <Checkbox value={value}>
                              <div className="flex items-center">
                                <span className="mr-2 text-gray-700">
                                  {label}
                                </span>
                              </div>
                            </Checkbox>
                          </CheckboxGroup>
                        )
                      )}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Fermer
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

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

  // State for Country and City
  const [cities, setCities] = useState([]);
  const [editableCountry, setEditableCountry] = useState("");
  const [editableCity, setEditableCity] = useState("Select a city");

  const colorfilter = "text-gray-400 text-xs";

  // Handle country change and reset the city selection to "Select a city"
  useEffect(() => {
    if (editableCountry && countryData[editableCountry]) {
      setCities(countryData[editableCountry]);
      setEditableCity("Select a city");
    } else {
      setCities([]);
      setEditableCity("Select a city");
    }
  }, [editableCountry]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setEditableCountry(selectedCountry);
    onCountryChange([selectedCountry]); // Assuming single country selection
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setEditableCity(selectedCity);
    onCityChange(selectedCity);
  };

  // Facilities data
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

  // Count the number of checked items
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
    onFavoritesChange(!showFavorites); // Inverse l'état des favoris
  };

  return (
    <div>
      <div className="hidden lg:block bg-gray-200 py-4">
        <div className="flex justify-between items-center px-4 pb-4 ">
          <div className="flex gap-2 w-full">
            <div className="w-1/4">
              <select
                value={editableCountry}
                onChange={handleCountryChange}
                className="border border-gray-300 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 text-xs w-[150px]"
              >
                <option value="" className="text-red-300">
                  {f("SelectionnezUnPays")}
                </option>
                {Object.keys(countryData).map((country) => (
                  <option key={country} value={country} className="text-black">
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/4">
              <select
                value={editableCity}
                onChange={handleCityChange}
                className="border border-gray-300 rounded-2xl py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 text-xs w-[150px]"
              >
                <option value="Select a city" className="text-red-300">
                  {f("SelectionnezUneVille")}
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city} className="text-black">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/4">
              <Button
                onClick={() => onOpenChange(true)}
                variant="light"
                radius="none"
                className="border border-gray-300 rounded-2xl h-fit py-[7px]  w-[150px] bg-white text-left flex justify-start "
              >
                <p className="text-left text-[11px] font-light text-gray-500">
                  {f("Residence")}({countChecked()})
                </p>
              </Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <div className="flex flex-col gap-2">
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
                                <span className="text-xs text-gray-500">
                                  ({countChecked([selected])})
                                </span>
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
            <div className="w-1/4 flex justify-center items-center pl-5">
              <div
                onClick={handleIconClick}
                className={`cursor-pointer flex items-center ${
                  showFavorites ? "text-red-500" : "text-gray-600"
                }`}
                aria-label="favorite"
              >
                {showFavorites ? (
                  <FaHeart size={20} color="#bfae9b" /> // Cœur plein si favori
                ) : (
                  <FaRegHeart size={20} color="#bfae9b" /> // Cœur vide si non favori
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" flex items-center w-full px-4 ">
          <div className="flex flex-col justify-center items-center  gap-2 w-full ">
            <div className="flex w-full">
              <div className="flex w-3/4 gap-3">
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
              <div className=" flex justify-center items-center  w-1/4 pl-5 pt-2">
                <div className="w-fit bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-2 ">
                  <Checkbox
                    isChecked={selectedGarden}
                    onChange={(e) => onGardenChange(e.target.checked)}
                    color="bgmap"
                    aria-label="Garden"
                    size="sm"
                    radius="full"
                    className="flex justify-center items-center py-1"
                  >
                    <p className={colorfilter}>{f("AvecJardin")}</p>
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden block">
        <div className="w-full flex justify-center">
          <Button
            onPress={onOpen}
            className="mb-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 w-fit"
          >
            Filtre
          </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="bg-gray-50 p-6 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-col w-full">
                    {/* Container for the select inputs */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                      {/* Country Select */}
                      <div className="w-full md:w-1/2">
                        <select
                          value={editableCountry}
                          onChange={handleCountryChange}
                          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-sm w-full shadow-sm hover:shadow-md transition duration-150"
                        >
                          <option value="" className="text-red-300">
                            {f("SelectionnezUnPays")}
                          </option>
                          {Object.keys(countryData).map((country) => (
                            <option
                              key={country}
                              value={country}
                              className="text-black"
                            >
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* City Select */}
                      <div className="w-full md:w-1/2">
                        <select
                          value={editableCity}
                          onChange={handleCityChange}
                          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-sm w-full shadow-sm hover:shadow-md transition duration-150"
                        >
                          <option
                            value="Select a city"
                            className="text-red-300"
                          >
                            {f("SelectionnezUneVille")}
                          </option>
                          {cities.map((city, index) => (
                            <option
                              key={index}
                              value={city}
                              className="text-black"
                            >
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Checkboxes for filtering options */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                      <div className="flex items-center">
                        <Checkbox
                          isChecked={showFavorites}
                          onChange={(e) => onFavoritesChange(e.target.checked)}
                          color="bgmap"
                          aria-label="favorite"
                          size="sm"
                        >
                          <span className="ml-2 text-gray-600">
                            {f("MesFavoris")}
                          </span>
                        </Checkbox>
                      </div>

                      <div className="flex items-center">
                        <Checkbox
                          isChecked={selectedGarden}
                          onChange={(e) => onGardenChange(e.target.checked)}
                          color="bgmap"
                          aria-label="Garden"
                          size="sm"
                        >
                          <span className="ml-2 text-gray-600">
                            {f("AvecJardin")}
                          </span>
                        </Checkbox>
                      </div>
                    </div>

                    {/* Slider modals */}
                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      {modalData.map(
                        ({
                          label,
                          range,
                          onRangeChange,
                          min,
                          max,
                          step,
                          isOpen,
                          setIsOpen,
                          id,
                        }) => (
                          <div
                            key={id}
                            className="flex flex-col w-full md:w-1/3"
                          >
                            <Button
                              onClick={() => setIsOpen(true)}
                              variant="light"
                              radius="none"
                              className="bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150"
                            >
                              <div className="flex justify-between">
                                <p className="text-gray-700">{label}</p>
                                <p className="text-gray-500">
                                  ({range[0]} - {range[1]})
                                </p>
                              </div>
                            </Button>
                            <Modal
                              isOpen={isOpen}
                              onOpenChange={setIsOpen}
                              id={id}
                            >
                              <ModalContent>
                                {(onClose) => (
                                  <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg">
                                    <h3 className="font-semibold text-lg mb-4">
                                      {label}
                                    </h3>
                                    <div className="flex justify-between mb-2">
                                      <div className="border-2 border-gray-300 rounded-md w-1/2 p-2 bg-gray-100">
                                        <p className="font-semibold text-sm">
                                          Min
                                        </p>
                                        <p>{range[0]}</p>
                                      </div>
                                      <div className="border-2 border-gray-300 rounded-md w-1/2 p-2 bg-gray-100">
                                        <p className="font-semibold text-sm">
                                          Max
                                        </p>
                                        <p>{range[1]}</p>
                                      </div>
                                    </div>
                                    <Slider
                                      min={min}
                                      max={max}
                                      step={step}
                                      value={range}
                                      onChange={onRangeChange}
                                      className="max-w-md mt-4"
                                      color="bgmap"
                                      aria-label={label}
                                      size="sm"
                                    />
                                  </div>
                                )}
                              </ModalContent>
                            </Modal>
                          </div>
                        )
                      )}
                    </div>

                    {/* Directly display the list of checkboxes for residence */}
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-lg mb-2">Résidences</h3>
                      {facilities.map(
                        ({ id, label, value, selected, onChange }) => (
                          <CheckboxGroup
                            key={id}
                            id={id}
                            value={selected ? [value] : []}
                            onChange={onChange}
                            color="bgmap"
                            orientation="vertical"
                            aria-label={label}
                          >
                            <Checkbox value={value}>
                              <div className="flex items-center">
                                <span className="mr-2 text-gray-700">
                                  {label}
                                </span>
                              </div>
                            </Checkbox>
                          </CheckboxGroup>
                        )
                      )}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Fermer
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
