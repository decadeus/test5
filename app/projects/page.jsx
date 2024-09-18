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
} from "@nextui-org/react";
import Image from "next/image";
import a from "@/components/image/appart1.jpg";
import { createClient } from "@/utils/supabase/client";
import { FaBed } from "react-icons/fa";
import { SlSizeFullscreen } from "react-icons/sl";
import { TbCurrencyZloty } from "react-icons/tb";
import { FaEuroSign, FaHeart, FaRegHeart } from "react-icons/fa";
import Map from "@/components/fullmap";
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/app/getimage/project";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiPersonSimpleSwimDuotone } from "react-icons/pi";
import { IoIosFitness } from "react-icons/io";
import { BiHandicap } from "react-icons/bi";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { BiCctv } from "react-icons/bi";
import { BiDoorOpen } from "react-icons/bi";
import dynamic from "next/dynamic";
import { TailSpin } from "react-loader-spinner";
import { projectIcons } from "@/lib/iconbuilding";

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
        ({ key, icon: Icon }) => project[key] && <Icon key={key} /> // Affiche l'icône si le projet possède la propriété correspondante
      )}
    </div>
  );
}

function Page() {
  const [projects, setProjects] = useState([]);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState([
    "France",
    "Poland",
  ]);
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

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .select(
        "*, project(*, city, lat, lng, mainpic_url, swim, fitness, child, disabled, bike, cctv, entrance)"
      )
      .order("surface", { ascending: false });
    if (error) {
      setError(error);
    } else {
      setOriginalProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem(NEW_FAVORITE_APARTMENTS_KEY)) || [];
    setFavorites(storedFavorites);
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCountries,
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

  const filteredProjects = useMemo(() => {
    let filtered = originalProjects.filter(
      (project) =>
        selectedCountries.includes(project.project.country) &&
        project.price >= priceRange[0] &&
        project.price <= priceRange[1] &&
        project.surface >= surfaceRange[0] &&
        project.surface <= surfaceRange[1] &&
        project.bed >= bedRange[0] &&
        project.bed <= bedRange[1] &&
        (!selectedGarden || project.garden === selectedGarden) &&
        (!selectedSwim || project.project.swim === selectedSwim) &&
        (!selectedFitness || project.project.fitness === selectedFitness) &&
        (!selectedChild || project.project.child === selectedChild) &&
        (!selectedDisabled || project.project.disabled === selectedDisabled) &&
        (!selectedBike || project.project.bike === selectedBike) &&
        (!selectedCctv || project.project.cctv === selectedCctv) &&
        (!selectedEntrance || project.project.entrance === selectedEntrance)
    );

    if (showFavorites) {
      filtered = filtered.filter((project) => favorites.includes(project.id));
    }

    return filtered;
  }, [
    originalProjects,
    selectedCountries,
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const fiche = "grid grid-cols-2 grid-rows-1 gap-4";

  const handleFeatureChange = (feature) => {
    setSelectedFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

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

  // Appel de la fonction avec vos projets filtrés
  const latLngExtremes = getLatLngExtremes(filteredProjects);

  // Afficher les valeurs extrêmes et les moyennes
  console.log(`Max Latitude: ${latLngExtremes.maxLat}`);
  console.log(`Moyenne Latitude: ${latLngExtremes.mLat}`);
  console.log(`Min Latitude: ${latLngExtremes.minLat}`);
  console.log(`Min Longitude: ${latLngExtremes.minLng}`);
  console.log(`Moyenne Longitude: ${latLngExtremes.mLng}`);
  console.log(`Max Longitude: ${latLngExtremes.maxLng}`);

  return (
    <div className="flex flex-col w-full gap-4 pt-4 bgfull text-black mb-16">
      <h1 className="text-5xl colortest mb-8">Listing Apartements</h1>
      <div className="mb-16">
      <p>Add your prject and list yours apartements </p>
      <button className="bgtest w-fit px-2 py-1 rounded-sm text-white text-sm"> Sign up to list your project</button>
      </div>
      <div className="flex flex-col xl:gap-4 gap-4">
        <div className="w-full">
          <Filter
            selectedCountries={selectedCountries}
            onCountryChange={handleCountryChange}
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
        <div className="w-full">
          <p className="font-bold text-center">
            Total: {filteredProjects.length} apartments found
          </p>
        </div>
        <div className="flex flex-col xl:flex-row lg:flex-row w-full">
          <div className="w-1/2 ">
            <div className="w-full h-[700px] z-0">
              <LazyMap
                classN="w-full h-[700px] z-0"
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

                        {/* Div qui reçoit l'effet de survol */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <a
                              href={item.project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={item.project.compagny}
                            >
                              <button
                                aria-label="compagny"
                                className="text-white hover:bg-blue-700 rounded-sm bgmap h-fit xl:px-16 px-4 py-2 font-bold"
                              >
                                See {item.project.compagny} project
                              </button>
                            </a>
                          </div>

                          <div className="px-2 pt-2 flex flex-col w-full sm:w-2/3 justify-between pb-2">
                            <div className="flex justify-between w-full">
                              <div className="w-full flex flex-col items-start justify-between">
                                <p className="font-bold text-md xl:text-xl text-md">
                                  {item.project.name}
                                </p>
                                <div>
                                  {item.noprice || item.price === null ? (
                                    <p className="flex gap-1 items-center italic">
                                      undefined
                                    </p>
                                  ) : (
                                    <p className="flex gap-1 items-center">
                                      {item.pricetype === "PLN" ? (
                                        <span className="flex">
                                          {item.price}{" "}
                                          <TbCurrencyZloty size={20} />
                                        </span>
                                      ) : (
                                        <span className="flex justify-center items-center">
                                          {item.price} <FaEuroSign size={13} />
                                        </span>
                                      )}
                                    </p>
                                  )}
                                </div>
                                <ProjectIconsDisplay project={item.project} />
                                <div className="flex gap-2">
                                  <div>
                                    <p>{item.surface} m²</p>
                                  </div>
                                  <div>
                                    <p>{item.bed} beds</p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <p className="font-semibold">
                                    {item.project.country}
                                  </p>
                                  <p>{item.project.city}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span>{`Page ${currentPage} of ${totalPages}`}</span>
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
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
  const htwo = "text-sm font-bold pb-4 ";
  const hthree = "text-sm";
  const hfouth = "flex flex-col gap-2";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSurfaceModalOpen, setIsSurfaceModalOpen] = useState(false);
  const [isBedsModalOpen, setIsBedsModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isResModalOpen, setIsResModalOpen] = useState(false);

  return (
    <div className="">
      <div className="flex justify-center items-center gap-4">
        {/* // Favorite */}
        <div className="bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
          <Checkbox
            isChecked={showFavorites}
            onChange={(e) => onFavoritesChange(e.target.checked)}
            color="bgmap"
            aria-label="favorite"
          >
            <p className={hthree}>Only favorite</p>
          </Checkbox>
        </div>
        {/* // Garden */}
        <div className="bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
          <CheckboxGroup
            value={selectedGarden ? ["garden"] : []}
            onChange={onGardenChange}
            color="bgmap"
            orientation="horizontal"
            aria-label="Garden"
          >
            <Checkbox value="garden">
              <p className={hthree}>Only with garden</p>
            </Checkbox>
          </CheckboxGroup>
        </div>
        {/* // Price */}
        <div className="">
          <Button onPress={() => setIsPriceModalOpen(true)} variant="light">
            <div className="flex gap-1 bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
              <p>Price</p>
              <p>
                {" "}
                ({priceRange[0]} - {priceRange[1]})
              </p>
            </div>
          </Button>
          <Modal
            isOpen={isPriceModalOpen}
            onOpenChange={setIsPriceModalOpen}
            id="price-modal"
          >
            <ModalContent>
              {(onClose) => (
                <div>
                  <div className="w-full flex gap-4 pb-4">
                    <div className="border-2 border-black rounded-sm w-1/2 p-2">
                      <p className="font-semibold text-sm">min</p>
                      <div className="flex items-center gap-1">
                        <p>{priceRange[0]}</p>
                      </div>
                    </div>
                    <div className="border-2 border-black rounded-sm w-1/2 p-2">
                      <p className="font-semibold text-sm">max</p>
                      <div className="flex items-center gap-1">
                        <p>{priceRange[1]}</p>
                      </div>
                    </div>
                  </div>
                  <Slider
                    min={0}
                    maxValue={2000000}
                    step={1}
                    value={priceRange}
                    onChange={onPriceRangeChange}
                    className="max-w-md"
                    color="bgmap"
                    aria-label="Surface"
                    size="sm"
                  />
                </div>
              )}
            </ModalContent>
          </Modal>
        </div>
        {/* // Surface */}
        <div className="">
          <Button onPress={() => setIsSurfaceModalOpen(true)} variant="light">
            <div className="flex gap-1 bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
              <p>Surface</p>
              <p>
                {" "}
                ({surfaceRange[0]} - {surfaceRange[1]})
              </p>
            </div>
          </Button>
          <Modal
            isOpen={isSurfaceModalOpen}
            onOpenChange={setIsSurfaceModalOpen}
            id="surface-modal"
          >
            <ModalContent>
              {(onClose) => (
                <div>
                  <div className="w-full flex gap-4 pb-4">
                    <div className="border-2 border-black rounded-sm w-1/2 p-2">
                      <p className="font-semibold text-sm">min</p>
                      <div className="flex items-center gap-1">
                        <p>{surfaceRange[0]}</p>
                      </div>
                    </div>
                    <div className="border-2 border-black rounded-sm w-1/2 p-2">
                      <p className="font-semibold text-sm">max</p>
                      <div className="flex items-center gap-1">
                        <p>{surfaceRange[1]}</p>
                      </div>
                    </div>
                  </div>
                  <Slider
                    min={0}
                    maxValue={200}
                    step={1}
                    value={surfaceRange}
                    onChange={onSurfaceRangeChange}
                    className="max-w-md"
                    color="bgmap"
                    aria-label="Surface"
                    size="sm"
                  />
                </div>
              )}
            </ModalContent>
          </Modal>
        </div>
        {/* // Bed*/}
        <div className="">
          <Button onPress={() => setIsBedsModalOpen(true)} variant="light">
            <div className="flex gap-1 bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
              <p>Beds</p>
              <p>
                {" "}
                ({bedRange[0]} - {bedRange[1]})
              </p>
            </div>
          </Button>
          <Modal
            isOpen={isBedsModalOpen}
            onOpenChange={setIsBedsModalOpen}
            id="beds-modal"
          >
            <ModalContent>
              {(onClose) => (
                <div>
                  <div className="w-full flex gap-4 pb-4">
                    <div className="border-2 border-black rounded-sm w-1/2 p-2">
                      <p className="font-semibold text-sm">min</p>
                      <div className="flex items-center gap-1">
                        <p>{bedRange[0]}</p>
                      </div>
                    </div>
                    <div className="border-2 border-black rounded-sm w-1/2 p-2">
                      <p className="font-semibold text-sm">max</p>
                      <div className="flex items-center gap-1">
                        <p>{bedRange[1]}</p>
                      </div>
                    </div>
                  </div>
                  <Slider
                    min={0}
                    maxValue={10}
                    step={1}
                    value={bedRange}
                    onChange={onBedRangeChange}
                    className="max-w-md"
                    color="bgmap"
                    aria-label="Number of bedrooms"
                    size="sm"
                  />
                </div>
              )}
            </ModalContent>
          </Modal>
        </div>

        <div className="">
          <Button onPress={() => setIsResModalOpen(true)} variant="light">
            <div className="flex gap-1 bg-white border-gray-300 border-1 rounded-sm text-sm px-2 py-2">
              <p>Residence</p>
              <p></p>
            </div>
          </Button>
          <Modal
            isOpen={isResModalOpen}
            onOpenChange={setIsResModalOpen}
            id="res-modal"
          >
            <ModalContent>
              {(onClose) => (
                <div className="flex flex-col gap-8 z-50">
                  <div>
                    <h3 className={htwo}>Amenities</h3>
                    <div className="flex flex-col gap-2">
                      <CheckboxGroup
                        id="swim"
                        value={selectedSwim ? ["swim"] : []}
                        onChange={onSwimChange}
                        color="bgmap"
                        orientation="horizontal"
                        aria-label="Swim"
                      >
                        <Checkbox value="swim">
                          <p className={hthree}>Swimming pool</p>
                        </Checkbox>
                      </CheckboxGroup>
                      <CheckboxGroup
                        id="fitness"
                        value={selectedFitness ? ["fitness"] : []}
                        onChange={onFitnessChange}
                        color="bgmap"
                        orientation="horizontal"
                        aria-label="Fitness"
                      >
                        <Checkbox value="fitness">
                          <p className={hthree}>Fitness room</p>
                        </Checkbox>
                      </CheckboxGroup>
                      <CheckboxGroup
                        id="child"
                        value={selectedChild ? ["child"] : []}
                        onChange={onChildChange}
                        color="bgmap"
                        orientation="horizontal"
                        aria-label="Child"
                      >
                        <Checkbox value="child">
                          <p className={hthree}>Children's playground</p>
                        </Checkbox>
                      </CheckboxGroup>
                      <CheckboxGroup
                        id="disabled"
                        value={selectedDisabled ? ["disabled"] : []}
                        onChange={onDisabledChange}
                        color="bgmap"
                        orientation="horizontal"
                        aria-label="Disabled"
                      >
                        <Checkbox value="disabled">
                          <p className={hthree}>Adapted for disabled people</p>
                        </Checkbox>
                      </CheckboxGroup>
                      <CheckboxGroup
                        id="bike"
                        value={selectedBike ? ["bike"] : []}
                        onChange={onBikeChange}
                        color="bgmap"
                        orientation="horizontal"
                        aria-label="Bike"
                      >
                        <Checkbox value="bike">
                          <p className={hthree}>Bicycle parking</p>
                        </Checkbox>
                      </CheckboxGroup>
                      <CheckboxGroup
                        id="cctv"
                        value={selectedCctv ? ["cctv"] : []}
                        onChange={onCctvChange}
                        color="bgmap"
                        orientation="horizontal"
                        aria-label="Cctv"
                      >
                        <Checkbox value="cctv">
                          <p className={hthree}>CCTV</p>
                        </Checkbox>
                      </CheckboxGroup>
                      <CheckboxGroup
                        id="entrance"
                        value={selectedEntrance ? ["entrance"] : []}
                        onChange={onEntranceChange}
                        color="bgmap"
                        orientation="horizontal"
                        aria-label="Entrance"
                      >
                        <Checkbox value="entrance">
                          <p className={hthree}>Entrance with reception</p>
                        </Checkbox>
                      </CheckboxGroup>
                    </div>
                  </div>
                </div>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
      {/*    <div className="flex sm:hidden justify-center">
        <Button
          onPress={onOpen}
          className="flex justify-center items-center text-center border-2 border-purple-900 bg-white text-purple-900 mb-4"
        >
          Filter
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior="inside"
          placement="bottom-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b-2 border-black">
                  Filter
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col w-full gap-8 pt-8 justify-evenly pr-8 ">
                    <div>
                      <div className="pb-8">
                        <h2 className="font-extrabold text-xl pb-4 ">
                          Favorites
                        </h2>
                        <Checkbox
                          isChecked={showFavorites}
                          onChange={(e) => onFavoritesChange(e.target.checked)}
                          color="bgmap"
                          aria-label="favorite"
                        >
                          <p className={hthree}>Only favorite</p>
                        </Checkbox>
                      </div>
                      <h2 className="font-extrabold text-xl pb-4">Country</h2>
                      <div className={hfouth}>
                        <CheckboxGroup
                          id="country"
                          value={selectedCountries}
                          onChange={onCountryChange}
                          color="bgmap"
                          aria-label="Country"
                          className="flex flex-col gap-2 "
                        >
                          <Checkbox value="France">
                            <p className={hthree}>France</p>
                          </Checkbox>
                          <Checkbox value="Poland">
                            <p className={hthree}>Poland</p>
                          </Checkbox>
                        </CheckboxGroup>
                      </div>
                    </div>
                    <div>
                      <h2 className="font-extrabold text-xl pb-4 ">
                        Apartement
                      </h2>
                      <div className="pb-8">
                        <h2 className={htwo}>Garden</h2>
                        <CheckboxGroup
                          value={selectedGarden ? ["garden"] : []}
                          onChange={onGardenChange}
                          color="bgmap"
                          orientation="horizontal"
                          aria-label="Garden"
                        >
                          <Checkbox value="garden">
                            <p className={hthree}>Only with garden</p>
                          </Checkbox>
                        </CheckboxGroup>
                      </div>

                      <div className="pb-8">
                        <h2 className={htwo}>Price range</h2>
                        <div className="w-full flex gap-4 pb-4">
                          <div className=" border-2 border-black rounded-sm w-1/2 p-2">
                            <p className="font-semibold text-sm">min</p>
                            <div className="flex items-center gap-1">
                              <TbCurrencyZloty size={15} />
                              <p>{priceRange[0]}</p>
                            </div>
                          </div>
                          <div className=" border-2 border-black rounded-sm w-1/2 p-2">
                            <p className="font-semibold text-sm">max</p>
                            <div className="flex items-center gap-1">
                              <TbCurrencyZloty size={15} />
                              <p>{priceRange[1]}</p>
                            </div>
                          </div>
                        </div>
                        <Slider
                          min={0}
                          maxValue={1000000} // Adjust this based on your data
                          step={1}
                          value={priceRange}
                          onChange={onPriceRangeChange}
                          className="max-w-md"
                          color="bgmap"
                          aria-label="Price range"
                          size="sm"
                        />
                      </div>
                      <div className="pb-8">
                        <p className={htwo}>Surface</p>
                        <div className="w-full flex gap-4 pb-4">
                          <div className=" border-2 border-black rounded-sm w-1/2 p-2">
                            <p className="font-semibold text-sm">min</p>
                            <div className="flex items-center gap-1">
                              <p className="text-xs">m2</p>
                              <p>{surfaceRange[0]}</p>
                            </div>
                          </div>
                          <div className=" border-2 border-black rounded-sm w-1/2 p-2">
                            <p className="font-semibold text-sm">max</p>
                            <div className="flex items-center gap-1">
                              <p className="text-xs">m2</p>
                              <p>{surfaceRange[1]}</p>
                            </div>
                          </div>
                        </div>
                        <Slider
                          min={0}
                          maxValue={200} // Adjust this based on your data
                          step={1}
                          value={surfaceRange}
                          onChange={onSurfaceRangeChange}
                          className="max-w-md"
                          color="bgmap"
                          aria-label="Surface"
                          size="sm"
                        />
                      </div>
                      <div className="">
                        <p className={htwo}>Number of bedrooms</p>
                        <div className="w-full flex gap-4 pb-4">
                          <div className=" border-2 border-black rounded-sm w-1/2 p-2">
                            <p className="font-semibold text-sm">min</p>
                            <div className="flex items-center gap-1">
                              <p>{bedRange[0]}</p>
                            </div>
                          </div>
                          <div className=" border-2 border-black rounded-sm w-1/2 p-2">
                            <p className="font-semibold text-sm">max</p>
                            <div className="flex items-center gap-1">
                              <p>{bedRange[1]}</p>
                            </div>
                          </div>
                        </div>
                        <Slider
                          min={0}
                          maxValue={10} // Adjust this based on your data
                          step={1}
                          value={bedRange}
                          onChange={onBedRangeChange}
                          className="max-w-md"
                          color="bgmap"
                          aria-label="Number of bedrooms"
                          size="sm"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="font-extrabold text-xl pb-4">Residence</h2>

                      <div className="flex flex-col gap-8">
                        <div>
                          <h3 className={htwo}>Amenities</h3>
                          <div className="flex flex-col gap-2">
                            <CheckboxGroup
                              id="swim"
                              value={selectedSwim ? ["swim"] : []}
                              onChange={onSwimChange}
                              color="bgmap"
                              orientation="horizontal"
                              aria-label="Swim"
                            >
                              <Checkbox value="swim">
                                <p className={hthree}>Swimming pool</p>
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              id="fitness"
                              value={selectedFitness ? ["fitness"] : []}
                              onChange={onFitnessChange}
                              color="bgmap"
                              orientation="horizontal"
                              aria-label="Fitness"
                            >
                              <Checkbox value="fitness">
                                <p className={hthree}>Fitness room</p>
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              id="child"
                              value={selectedChild ? ["child"] : []}
                              onChange={onChildChange}
                              color="bgmap"
                              orientation="horizontal"
                              aria-label="Child"
                            >
                              <Checkbox value="child">
                                <p className={hthree}>Children's playground</p>
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              id="disabled"
                              value={selectedDisabled ? ["disabled"] : []}
                              onChange={onDisabledChange}
                              color="bgmap"
                              orientation="horizontal"
                              aria-label="Disabled"
                            >
                              <Checkbox value="disabled">
                                <p className={hthree}>
                                  Adapted for disabled people
                                </p>
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              id="bike"
                              value={selectedBike ? ["bike"] : []}
                              onChange={onBikeChange}
                              color="bgmap"
                              orientation="horizontal"
                              aria-label="Bike"
                            >
                              <Checkbox value="bike">
                                <p className={hthree}>Bicycle parking</p>
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              id="cctv"
                              value={selectedCctv ? ["cctv"] : []}
                              onChange={onCctvChange}
                              color="bgmap"
                              orientation="horizontal"
                              aria-label="Cctv"
                            >
                              <Checkbox value="cctv">
                                <p className={hthree}>CCTV</p>
                              </Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup
                              id="entrance"
                              value={selectedEntrance ? ["entrance"] : []}
                              onChange={onEntranceChange}
                              color="bgmap"
                              orientation="horizontal"
                              aria-label="Entrance"
                            >
                              <Checkbox value="entrance">
                                <p className={hthree}>
                                  Entrance with reception
                                </p>
                              </Checkbox>
                            </CheckboxGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Search
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div> */}
    </div>
  );
}
