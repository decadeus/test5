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
} from "@nextui-org/react";

import { createClient } from "@/utils/supabase/client";
import { FaEuroSign, FaHeart, FaRegHeart } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/app/getimage/project";
import dynamic from "next/dynamic";
import { TailSpin } from "react-loader-spinner";
import { projectIcons } from "@/lib/iconbuilding";
import { countryData } from "@/utils/countryData";
import Link from "next/link";
import Loading from "@/app/loading";


const NEW_FAVORITE_APARTMENTS_KEY = "favoriteApartments";
const ITEMS_PER_PAGE = 4;

const LazyMap = dynamic(() => import("@/app/map/index"), {
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

  const sort = [
    { key: "surface", label: "surface" },
    { key: "bed", label: "bed" },
  ];

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .select(
        "*, project(*, city, lat, lng, mainpic_url, swim, fitness, child, disabled, bike, cctv, entrance)"
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
    <div className="flex flex-col w-full gap-4 pt-4 bgfull text-black mb-16">
      <h1 className="text-5xl colortest  font-satisfy pl-4">Listing Apartements</h1>
      <div className="pl-4">
        
        <div className="flex  w-full my-8 ">
          
          <Link
            href="/projects"
            className="border-2 brownborder p-2 w-fit clearbg browntext rounded hover:bg-[#c9af95] hover:text-[#f6f6f4] hover:border-black transition-all duration-500"
          >
            Sign up to list your project
          </Link>
        </div>

       
      </div>
      <div className="flex flex-col xl:gap-4 gap-4">
        <div className="w-full">
          <Filter
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
          />
        </div>

        <div className="flex flex-col xl:flex-row lg:flex-row w-full">
          <div className="w-1/2 ">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs text-center text-gray-500">
                Total: {filteredProjects.length} apartments found
              </p>
              <div className="flex items-center">
                <label
                  className="text-xs mr-2 w-[300px] text-right text-gray-500"
                  htmlFor="sort-select"
                >
                  Sort by (high to low)
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
            <div className="w-full h-[650px] z-0">
              <LazyMap
                classN="w-full h-[650px] z-0"
                todos={filteredProjects.map(({ project }) => ({
                  lat: project?.lat,
                  lng: project?.lng,
                  name: project?.name,
                  country: project?.country,
                  city: project?.city,
                  compagny: project?.compagny,
                  mainpic_url: project?.mainpic_url,
                }))}
                maxLat={latLngExtremes.maxLat} // Passer maxLat
                minLng={latLngExtremes.minLng}
                mLng={latLngExtremes.mLng}
                mLat={latLngExtremes.mLat} // Passer minLng
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="w-full flex flex-wrap">
              <ScrollArea className="h-fit w-full pl-4 pb-4">
                <div className="relative flex flex-wrap gap-2">
                  {projects.map((item, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col w-full md:w-[48%] gap-4 border shadow-lg rounded-sm group"
                    >
                      <div className="flex flex-col w-full gap-4 ">
                        <div className="relative h-40 w-full">
                          <Avatar
                            url={item.project.mainpic_url}
                            width={270}
                            height={196}
                            classn="rounded-sm"
                          />
                          {item.des && (
                            <div className="absolute top-2 left-2">
                              <p className="text-white bgtest rounded-sm px-2 text-sm">
                                {item.des}
                              </p>
                            </div>
                          )}
                          <Button
                            style={{
                              position: "absolute",
                              top: "1px",
                              right: "0px",
                            }}
                            onClick={() => handleToggleFavorite(item)}
                            className="bg-transparent text-white hover:bg-opacity-10"
                            aria-label="favorite"
                          >
                            {isFavorite(item) ? (
                              <FaHeart fill="red" size={20} />
                            ) : (
                              <FaRegHeart fill="red" size={20} />
                            )}
                          </Button>
                        </div>
                        <div className="relative group transition duration-300">
                          {/* Le div principal qui subit le flou */}
                          <div className="transition duration-300 group-hover:blur-sm">
                            <div className="px-2 pt-2 flex flex-col w-full sm:w-2/3 justify-between pb-2">
                              <div className="flex justify-between w-full">
                                <div className="w-full flex flex-col items-start justify-between text-gray-500">
                                  <p className="text-md">{item.project.name}</p>
                                  <div className="mb-2">
                                    {item.noprice || item.price === null ? (
                                      <p className="flex gap-1 items-center italic text-xl">
                                        undefined
                                      </p>
                                    ) : (
                                      <p className="flex gap-1 items-center font-bold text-xl">
                                        {item.pricetype === "PLN" ? (
                                          <span className="flex">
                                            {item.price}{" "}
                                            <TbCurrencyZloty size={20} />
                                          </span>
                                        ) : (
                                          <span className="flex justify-center items-center text-xl">
                                            {item.price}{" "}
                                            <FaEuroSign size={13} />
                                          </span>
                                        )}
                                      </p>
                                    )}
                                  </div>
                                  <ProjectIconsDisplay project={item.project} />
                                  <div className="flex flex-col gap-2 text-xs text-gray-500 ">
                                    <div className="flex gap-2">
                                      <div>
                                        <p>{item.surface} m²</p>
                                      </div>
                                      <div>
                                        <p>{item.bed} beds</p>
                                      </div>
                                    </div>
                                    <p>{item.project.adresse}</p>
                                  </div>

                                  <div className="flex gap-2 text-xs text-gray-500">
                                    <p className="font-semibold">
                                      {item.project.country}
                                    </p>
                                    <p>{item.project.city}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Le bouton qui apparaît uniquement lors du survol */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <a
                              href={item.project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={item.project.company}
                            >
                              <button
                                aria-label="company"
                                className="rounded-full border-black border-2"
                                style={{
                                 
                                 
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '50%',
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  backdropFilter: "blur(8px)", // Couleur blanche et opaque
                                  display: 'flex', // Utiliser flexbox pour centrer le texte
                                  alignItems: 'center', // Centrer verticalement
                                  justifyContent: 'center', // Centrer horizontalement
                                  pointerEvents: 'none', // Ignorer les événements de souris
                                  transition: 'opacity 0.2s',
                                  textAlign: "center",
                                  
                                }}
                              
                              >
                                See {item.project.company} project
                              </button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 text-gray-500">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="text-gray-500 border bg-white border-gray-400 hover:bg-gray-400 hover:text-white"
                  >
                    Previous
                  </Button>
                  <span>{`Page ${currentPage} of ${totalPages}`}</span>
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="text-gray-500 border bg-white border-gray-400 hover:bg-gray-400 hover:text-white"
                  >
                    Next
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
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
      label: "Price",
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
      label: "Surface",
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
      label: "Beds",
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
    <div className="flex items-center w-full pl-4 ">
      <div className="flex justify-center items-center w-5/12 gap-2">
        <div className="flex flex-col w-1/2">
          <select
            value={editableCountry}
            onChange={handleCountryChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 text-xs"
          >
            <option value="" className="text-red-300">
              Select a country
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
              Select a city
            </option>
            {cities.map((city, index) => (
              <option key={index} value={city} className="text-black">
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-center items-center w-7/12 gap-2">
        <div className="flex pr-2 gap-2">
          <div className="bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
            <Checkbox
              isChecked={showFavorites}
              onChange={(e) => onFavoritesChange(e.target.checked)}
              color="bgmap"
              aria-label="favorite"
              size="sm"
            >
              <p className={colorfilter}>Only favorite</p>
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
              <p className={colorfilter}>Only with garden</p>
            </Checkbox>
          </div>
        </div>

        <div className="flex gap-2 py-2 ">
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
                <p className={colorfilter}>Residence ({countChecked()})</p>
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
  );
}


