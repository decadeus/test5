"use client";
import React, { useState, useEffect } from "react";
import {
  Checkbox,
  CheckboxGroup,
  Slider,
  Button,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Filter from "@/components/svg/filter";

const FilterB = ({
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
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSurfaceModalOpen, setIsSurfaceModalOpen] = useState(false);
  const [isBedsModalOpen, setIsBedsModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [editableCountry, setEditableCountry] = useState("");
  const [editableCity, setEditableCity] = useState("Select city");
  const [countryData, setCountryData] = useState({});

  const colorfilter = "text-sm text-gray-800";

  useEffect(() => {
    async function fetchCountries() {
      const supabase = (await import("@/utils/supabase/client")).createClient();
      const { data, error } = await supabase
        .from("project")
        .select("country, city");

      if (error) {
        console.error("Error fetching countries:", error);
        return;
      }

      // Format: { country: [cities] }
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
    const storedCountry = localStorage.getItem("selectedCountry") || "";
    const storedCity = localStorage.getItem("selectedCity") || "";
    if (storedCity) {
      setEditableCity(storedCity);
      onCityChange(storedCity);
    }
    if (Object.keys(countryData).length > 0) {
      setEditableCountry(storedCountry);
      onCountryChange([storedCountry]);
      if (storedCountry && countryData[storedCountry]) {
        const availableCities = countryData[storedCountry];
        setCities(availableCities);
        const defaultCity = availableCities.includes(storedCity)
          ? storedCity
          : availableCities.length > 0
          ? availableCities[0]
          : "";
        setEditableCity(defaultCity);
        onCityChange(defaultCity);
      }
    }
    // eslint-disable-next-line
  }, [countryData]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setEditableCountry(selectedCountry);
    onCountryChange([selectedCountry]);
    localStorage.setItem("selectedCountry", selectedCountry);
    if (selectedCountry && countryData[selectedCountry]) {
      const availableCities = ["Select city", ...countryData[selectedCountry]];
      setCities(availableCities);
      setEditableCity("Select city");
      onCityChange("Select city");
      localStorage.setItem("selectedCity", "Select city");
    } else {
      setCities(["Select city"]);
      setEditableCity("Select city");
      onCityChange("Select city");
      localStorage.setItem("selectedCity", "Select city");
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setEditableCity(selectedCity);
    onCityChange(selectedCity);
    localStorage.setItem("selectedCity", selectedCity);
  };

  const facilities = [
    { id: "swim", label: "Swimming pool", value: "swim", selected: selectedSwim, onChange: onSwimChange },
    { id: "fitness", label: "Fitness room", value: "fitness", selected: selectedFitness, onChange: onFitnessChange },
    { id: "child", label: "Children's playground", value: "child", selected: selectedChild, onChange: onChildChange },
    { id: "disabled", label: "Adapted for disabled people", value: "disabled", selected: selectedDisabled, onChange: onDisabledChange },
    { id: "bike", label: "Bicycle parking", value: "bike", selected: selectedBike, onChange: onBikeChange },
    { id: "cctv", label: "CCTV", value: "cctv", selected: selectedCctv, onChange: onCctvChange },
    { id: "entrance", label: "Entrance with reception", value: "entrance", selected: selectedEntrance, onChange: onEntranceChange },
  ];

  const modalData = [
    { label: f("Prix"), range: priceRange, onRangeChange: onPriceRangeChange, min: 0, max: 1000000, step: 1, id: "price-modal" },
    { label: f("Surface"), range: surfaceRange, onRangeChange: onSurfaceRangeChange, min: 0, max: 200, step: 1, id: "surface-modal" },
    { label: f("Chambres"), range: bedRange, onRangeChange: onBedRangeChange, min: 0, max: 10, step: 1, id: "beds-modal" },
  ];

  const handleIconClick = () => onFavoritesChange(!showFavorites);

  return (
    <div>
      <div className="hidden lg:block py-4 w-full">
        <div className="flex justify-between">
          <div className="flex gap-2 w-1/2">
            {/* Pays */}
            <div>
              <select
                value={editableCountry}
                onChange={handleCountryChange}
                className="w-[100px] border-gray-300 border-1 rounded-2xl text-sm px-2 py-2"
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
            {/* Ville */}
            <div>
              <select
                value={editableCity}
                onChange={handleCityChange}
                className="w-[150px] bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-2"
              >
                {cities.map((city, index) => (
                  <option key={index} value={city} className="text-black">
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {/* Jardin */}
            <div>
              <div className="w-fit bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-2">
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
            {/* Favoris */}
            <div
              onClick={handleIconClick}
              className={`cursor-pointer flex w-fit bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-2 ${showFavorites ? "text-red-500" : "text-gray-600"}`}
              aria-label="favorite"
            >
              <p className="pr-2 text-sm text-gray-800">Your favorite</p>
              {showFavorites ? (
                <FaHeart size={20} color="#bfae9b" />
              ) : (
                <FaRegHeart size={20} color="#bfae9b" />
              )}
            </div>
            {/* Résidence (modal équipements) */}
            <div>
              <Button
                onClick={() => onOpenChange(true)}
                variant="light"
                radius="none"
                className="w-fit bg-white border-gray-300 border-1 rounded-2xl text-sm px-2 py-3"
                id="equip"
              >
                <p className="text-left text-sm flex items-center text-gray-800">
                  {f("Residence")}
                </p>
                <Filter className="w-8 h-8" />
              </Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
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
                </ModalContent>
              </Modal>
            </div>
          </div>
          {/* Sliders */}
          <div className="flex flex-col gap-2 w-1/2 justify-end items-end">
            <div className="flex w-full justify-center items-end">
              <div className="flex w-full gap-3">
                {modalData.map(({ label, range, onRangeChange, min, max, step, id }) => (
                  <div key={id} className="w-full">
                    <div className="flex justify-between text-xs pb-1">
                      <p className={colorfilter}>{label}</p>
                      <p className={colorfilter}>
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
                        track: "border-s-brownd h-[2px] bg-white ",
                        filler: "bg-gradient-to-r from-custom-brownc to-custom-brownd",
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Version mobile : tu peux garder ton modal mobile d'origine ici si tu veux */}
    </div>
  );
};

export default FilterB;
