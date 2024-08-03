"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, CheckboxGroup, Slider, Button } from "@nextui-org/react";
import Image from "next/image";
import a from "@/components/image/appart1.jpg";
import { createClient } from "@/utils/supabase/client";
import { FaBed } from "react-icons/fa";
import { SlSizeFullscreen } from "react-icons/sl";
import { TbCurrencyZloty } from "react-icons/tb";
import { FaEuroSign } from "react-icons/fa";
import Map from "@/components/fullmap";
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Adjust max value based on your data
  const [surfaceRange, setSurfaceRange] = useState([0, 200]);
  const [bedRange, setBedRange] = useState([0, 10]);

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .select("*, project(*, lat, lng, mainpic_url)");
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

  const filteredProjects = useMemo(() => {
    return originalProjects.filter(
      (project) =>
        selectedCountries.includes(project.project.country) &&
        project.price >= priceRange[0] &&
        project.price <= priceRange[1] &&
        project.surface >= surfaceRange[0] &&
        project.surface <= surfaceRange[1] &&
        project.bed >= bedRange[0] &&
        project.bed <= bedRange[1] &&
        (!selectedGarden || project.garden === selectedGarden)
    );
  }, [originalProjects, selectedCountries, priceRange, surfaceRange, bedRange, selectedGarden]);

  useEffect(() => {
    setProjects(filteredProjects);
  }, [filteredProjects]);

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
    setSelectedGarden(selected.includes('garden'));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const fiche = "grid grid-cols-2 grid-rows-1 gap-4";
  return (
    <div className="flex flex-col w-full px-16">
      <div>
        <Filter
          selectedCountries={selectedCountries}
          onCountryChange={handleCountryChange}
          selectedGarden={selectedGarden}
          onGardenChange={handleGardenChange}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          surfaceRange={surfaceRange}
          onSurfaceRangeChange={handleSurfaceRangeChange}
          bedRange={bedRange}
          onBedRangeChange={handleBedRangeChange}
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-1 gap-4 h-[600px]">
        <div className="w-full">
          <div className="w-full flex gap-4 flex-wrap">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {filteredProjects.map((item, index) => (
                <div key={index} className="flex flex-col w-full gap-4 mt-4 border shadow-sm">
                  <div className="flex  gap-4 w-full">
                    <div className="relative h-40 w-1/2 ">
                      <Image
                        src={item.mainpic_url || a}
                        layout="fill"
                        objectFit="cover"
                        alt="Project Image"
                      />
                    </div>
                    <div className="px-2 pt-2 flex flex-col w-1/2 ">
                      <div className="flex justify-between w-full">
                        <div className="">
                          <p className="flex gap-2 items-center">
                            {item.pricetype === "PLN" ? (
                              <>
                                <TbCurrencyZloty size={20} /> {item.price}
                              </>
                            ) : (
                              <>
                                <FaEuroSign /> {item.price}
                              </>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="flex gap-2 items-center">
                            <SlSizeFullscreen size={15} /> {item.surface} m²
                          </p>
                        </div>
                        <div>
                          <p className="flex gap-2 items-center">
                            <FaBed size={20} /> {item.bed}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <p>{item.project.city}</p>
                        <p>{item.project.country}</p>
                      </div>
                      <div className="w-fit">
                        <Button color="secondary">Voir</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <div className="">
          <Map
            classN="w-full h-full h-[200px] rounded-2xl"
            todos={filteredProjects.map(({ project }) => ({
              lat: project?.lat,
              lng: project?.lng,
            }))}
          />
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
  priceRange,
  onPriceRangeChange,
  surfaceRange,
  onSurfaceRangeChange,
  bedRange,
  onBedRangeChange,
}) {
  const htwo = "text-sm font-bold ";

  return (
    <div className="flex w-full gap-8 pt-8 justify-center">
      <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <h2 className={htwo}>Country</h2>
        <CheckboxGroup
          value={selectedCountries}
          onChange={onCountryChange}
          color="secondary"
          orientation="horizontal"
          aria-label="Country"
        >
          <Checkbox value="France">France</Checkbox>
          <Checkbox value="Poland">Poland</Checkbox>
        </CheckboxGroup>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className={htwo}>Garden</h2>
        <CheckboxGroup
          value={selectedGarden ? ['garden'] : []}
          onChange={onGardenChange}
          color="secondary"
          orientation="horizontal"
          aria-label="Garden"
        >
          <Checkbox value="garden">With garden</Checkbox>
        </CheckboxGroup>
      </div>
      </div>
<div className="flex w-2/3 gap-4">
      <div className="flex flex-col gap-2 w-1/3">
        <h2 className={htwo}>Price range</h2>
        <Slider
          min={0}
          maxValue={1000000} // Adjust this based on your data
          step={1}
          value={priceRange}
          onChange={onPriceRangeChange}
          range
          className="max-w-md"
          color="secondary"
          aria-label="Price range"
        />
        <div className="flex justify-between">
          <p className="text-default-500 font-medium text-small">
            Selected price: {priceRange[0]} – {priceRange[1]}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        <p className={htwo}>Surface</p>
        <Slider
          min={0}
          maxValue={200} // Adjust this based on your data
          step={1}
          value={surfaceRange}
          onChange={onSurfaceRangeChange}
          range
          className="max-w-md"
          color="secondary"
          aria-label="Surface"
        />
        <div className="flex justify-between">
          <p className="text-default-500 font-medium text-small">
            Selected surface: {surfaceRange[0]} – {surfaceRange[1]}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        <p className={htwo}>Number of bedrooms</p>
        <Slider
          min={0}
          maxValue={10} // Adjust this based on your data
          step={1}
          value={bedRange}
          onChange={onBedRangeChange}
          range
          className="max-w-md"
          color="secondary"
          aria-label="Number of bedrooms"
        />
        <div className="flex justify-between">
          <p className="text-default-500 font-medium text-small">
            Selected bedrooms: {bedRange[0]} – {bedRange[1]}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
