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
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/app/getimage/Ugetone";

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
      .select("*, project(*, lat, lng, mainpic_url)")
      .order('surface', { ascending: false });
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
    const filtered = originalProjects.filter(
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
    console.log('Filtered Projects Count:', filtered.length); // Log the count
    return filtered;
  }, [
    originalProjects,
    selectedCountries,
    priceRange,
    surfaceRange,
    bedRange,
    selectedGarden,
  ]);

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
    setSelectedGarden(selected.includes("garden"));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const fiche = "grid grid-cols-2 grid-rows-1 gap-4";
  return (
    <div className="flex flex-col w-full px-60 gap-16 pt-16">

      <div className="flex flex-col gap-4">
        <div className="w-full h-[270px]">
          <Map
            classN="w-full h-full h-[270px] rounded-2xl"
            todos={filteredProjects.map(({ project }) => ({
              lat: project?.lat,
              lng: project?.lng,
            }))}
          />
        </div>
        <div className="flex w-full">
          <div className="w-1/3">
            <div className="w-full">
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
          </div>
          <div className="w-2/3">
            <div className="w-full flex gap-4 flex-wrap">
              <ScrollArea className="h-[1000px] w-full p-4">
              <div>
                <p>Total Projects: {filteredProjects.length}</p> {/* Display the count */}
              </div>
                {filteredProjects.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-full gap-4 mt-4 border shadow-lg rounded-xl pr-2"
                  >
                    <div className="flex  gap-4 w-full">
                      <div className="relative h-40 w-1/3">
                      <Avatar
                              url={item.project.mainpic_url || a}
                              width={270}
                              height={196}
                              classn="rounded-2xl"
                            />
                      </div>
                      <div className="px-2 pt-2 flex flex-col w-2/3 ">
                        <div className="flex justify-between w-full">
                          <div className="w-1/2">
                            <p className="font-bold">{item.project.name}</p>
                            <p>{item.project.city}</p>
                            <p>{item.project.country}</p>
                          </div>
                          <div className="w-1/2 flex flex-col items-end">
                            <p className="flex gap-1 items-center">
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
                            <p>{item.surface} m2</p>
                            <p>{item.bed}</p>
                            <div className="w-fit">
                              <Button color="secondary">Voir</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
  priceRange,
  onPriceRangeChange,
  surfaceRange,
  onSurfaceRangeChange,
  bedRange,
  onBedRangeChange,
}) {
  const htwo = "text-sm font-bold pb-4 ";
  const hthree = "text-sm";
  const hfouth = "flex flex-col gap-2";

  return (
    <div className="flex flex-col w-full gap-8 pt-8 justify-evenly pr-8">
     
        <div>
          <h2 className={htwo}>Country</h2>
          <div className={hfouth}>
            <CheckboxGroup
              value={selectedCountries}
              onChange={onCountryChange}
              color="secondary"
              aria-label="Country"
              className="flex flex-col gap-2"
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
        <h2 className="font-extrabold text-xl">Apartement</h2>
        <div className="">
          <h2 className={htwo}>Garden</h2>
          <CheckboxGroup
            value={selectedGarden ? ["garden"] : []}
            onChange={onGardenChange}
            color="secondary"
            orientation="horizontal"
            aria-label="Garden"
          >
            <Checkbox value="garden"><p className={hthree}>With garden</p></Checkbox>
          </CheckboxGroup>
        </div>
    
     
        <div className="">
          <h2 className={htwo}>Price range</h2>
          <Slider
            min={0}
            maxValue={1000000} // Adjust this based on your data
            step={1}
            value={priceRange}
            onChange={onPriceRangeChange}
            className="max-w-md"
            color="secondary"
            aria-label="Price range"
            size="sm"
          />
          <div className="flex justify-between">
            <p className="text-default-500 font-medium text-small pt-2">
              Price: {priceRange[0]} – {priceRange[1]}
            </p>
          </div>
        </div>
        <div className="">
          <p className={htwo}>Surface</p>
          <Slider
            min={0}
            maxValue={200} // Adjust this based on your data
            step={1}
            value={surfaceRange}
            onChange={onSurfaceRangeChange}
            className="max-w-md"
            color="secondary"
            aria-label="Surface"
            size="sm"
          />
          <div className="flex justify-between">
            <p className="text-default-500 font-medium text-small pt-2">
              Surface: {surfaceRange[0]} – {surfaceRange[1]}
            </p>
          </div>
        </div>
        <div className="">
          <p className={htwo}>Number of bedrooms</p>
          <Slider
            min={0}
            maxValue={10} // Adjust this based on your data
            step={1}
            value={bedRange}
            onChange={onBedRangeChange}
            className="max-w-md"
            color="secondary"
            aria-label="Number of bedrooms"
            size="sm"
          />
          <div className="flex justify-between">
            <p className="text-default-500 font-medium text-small pt-2">
              Bedrooms: {bedRange[0]} – {bedRange[1]}
            </p>
          </div>
        </div>
        <h2 className="font-extrabold text-xl">Residence</h2>
     
      <div className="">
        <h3 className={htwo}>Amenities</h3>
        <div className="flex flex-col gap-2">
          <Checkbox>
            <p className={hthree}>Swimming pool</p>
          </Checkbox>
          <Checkbox>
            <p className={hthree}>Fitness room</p>
          </Checkbox>
      
    
          <Checkbox>
            <p className={hthree}>Children's playground</p>
          </Checkbox>

          <Checkbox>
            <p className={hthree}>Building adapted for disabled people</p>
          </Checkbox>
          <Checkbox>
            <p className={hthree}>Bicycle parking</p>
          </Checkbox>
      

        </div>
        <h3 className={htwo}>Security</h3>
        <div className="flex flex-col gap-2">
        
          <Checkbox>
            <p className={hthree}>Entrance with reception</p>
          </Checkbox>
          <Checkbox>
            <p className={hthree}>Fenced area</p>
          </Checkbox>
 
          <Checkbox>
            <p className={hthree}>CCTV</p>
          </Checkbox>
        
          <Checkbox>
            <p className={hthree}>closed subdivision</p>
          </Checkbox>

        </div>
      </div>
    </div>
  );
}
