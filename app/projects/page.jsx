'use client';

import React, { useState, useEffect } from "react";
import { Checkbox, CheckboxGroup, Input } from "@nextui-org/react";
import Image from "next/image";
import a from "@/components/image/appart1.jpg";
import { createClient } from "@/utils/supabase/client";

function Page() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState(["France", "Poland"]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [minSurface, setMinSurface] = useState(0);
  const [maxSurface, setMaxSurface] = useState(Infinity);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("projectlist").select("*, project(city, country)");
      if (error) {
        setError(error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleCountryChange = (selected) => {
    setSelectedCountries(selected);
  };

  const handleMinPriceChange = (event) => {
    const value = parseFloat(event.target.value);
    setMinPrice(value);
    if (value > maxPrice) {
      setMaxPrice(value);
    }
  };

  const handleMaxPriceChange = (event) => {
    const value = parseFloat(event.target.value);
    if (value >= minPrice) {
      setMaxPrice(value);
    }
  };

  const handleMinSurfaceChange = (event) => {
    const value = parseFloat(event.target.value);
    setMinSurface(value);
    if (value > maxSurface) {
      setMaxSurface(value);
    }
  };

  const handleMaxSurfaceChange = (event) => {
    const value = parseFloat(event.target.value);
    if (value >= minSurface) {
      setMaxSurface(value);
    }
  };

  const filteredProjects = projects.filter(project =>
    selectedCountries.includes(project.project.country) &&
    project.price >= minPrice &&
    project.price <= maxPrice &&
    project.surface >= minSurface &&
    project.surface <= maxSurface
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const fiche = "shadow-lg pb-4";
  return (
    <div className="flex w-full px-16">
      <div className="w-2/6">
        <Filter
          selectedCountries={selectedCountries}
          onCountryChange={handleCountryChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          minSurface={minSurface}
          maxSurface={maxSurface}
          onMinSurfaceChange={handleMinSurfaceChange}
          onMaxSurfaceChange={handleMaxSurfaceChange}
        />
      </div>
      <div className="w-4/6">
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {filteredProjects.map((item, index) => (
            <div key={index} className={fiche}>
              <div className="relative h-36 w-full">
                <Image
                  src={item.pic || a}
                  layout="fill"
                  objectFit="cover"
                  alt="Project Image"
                />
              </div>
              <div className="px-2">
                <h3>City: {item.project.city}</h3>
                <p>Price: ${item.price}</p>
                <p>Surface: {item.surface} m²</p>
                <p>Bed: {item.bed}</p>
                <p>Available: {item.available}</p>
                <h3>Country: {item.project.country}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;

function Filter({
  selectedCountries,
  onCountryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minSurface,
  maxSurface,
  onMinSurfaceChange,
  onMaxSurfaceChange
}) {
  const htwo = "text-sm font-bold";
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className={htwo}>Country</h2>
        <CheckboxGroup
          value={selectedCountries}
          onChange={onCountryChange}
          color="secondary"
        >
          <Checkbox value="France">France</Checkbox>
          <Checkbox value="Poland">Poland</Checkbox>
        </CheckboxGroup>
      </div>
      <h2 className={htwo}>Price range</h2>
      <div className="flex w-fit flex-wrap md:flex-nowrap gap-4">
        <Input
          type="number"
          size="sm"
          radius="lg"
          variant="bordered"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-lg",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="min..."
          value={minPrice === 0 ? "" : minPrice}
          onChange={onMinPriceChange}
        />
        <Input
          type="number"
          size="sm"
          radius="lg"
          variant="bordered"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-lg",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="max..."
          value={maxPrice === Infinity ? "" : maxPrice}
          onChange={onMaxPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className={htwo}>Surface</h2>
        <div className="flex w-fit flex-wrap md:flex-nowrap gap-4">
          <Input
            type="number"
            size="sm"
            radius="lg"
            variant="bordered"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-lg",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="min..."
            value={minSurface === 0 ? "" : minSurface}
            onChange={onMinSurfaceChange}
          />
          <Input
            type="number"
            size="sm"
            radius="lg"
            variant="bordered"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-lg",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="max..."
            value={maxSurface === Infinity ? "" : maxSurface}
            onChange={onMaxSurfaceChange}
          />
        </div>
      </div>
    </div>
  );
}


{
  /* <div className="flex flex-col gap-2">
        
      </div>
      <div className="flex flex-col gap-2">
        <h2 className={htwo}>Surface</h2>
        <div className="flex w-fit flex-wrap md:flex-nowrap gap-4">
          <Input
            type="text"
            size="sm"
            radius="lg"
            variant="bordered"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-lg",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="min..."
          />
          <Input
            type="text"
            size="sm"
            radius="lg"
            variant="bordered"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-lg",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="max..."
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className={htwo}>Bedrooms</h2>
        <CheckboxGroup
          orientation="horizontal"
          color="secondary"
          defaultValue={["buenos-aires", "san-francisco"]}
        >
          <Checkbox value="buenos-aires" size="sm">
            1
          </Checkbox>
          <Checkbox value="sydney" size="sm" className="pl-8">
            2
          </Checkbox>
          <Checkbox value="san-francisco" size="sm" className="pl-8">
            3
          </Checkbox>
          <Checkbox value="london" size="sm" className="pl-8">
            4
          </Checkbox>
          <Checkbox value="tokyo" size="sm" className="pl-8">
            5
          </Checkbox>
          <Checkbox value="tokyo" size="sm" className="pl-8">
            5+
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className={htwo}>Available</h2>
        <CheckboxGroup
          orientation="horizontal"
          color="secondary"
          defaultValue={["buenos-aires", "san-francisco"]}
        >
          <div className="flex flex-col justify-start gap-2">
            <Checkbox value="buenos-aires" size="sm">
              Available
            </Checkbox>
            <Checkbox value="sydney" size="sm" className="">
              Less 3 months
            </Checkbox>
            <Checkbox value="san-francisco" size="sm" className="">
              3 months/ 6 months
            </Checkbox>
            <Checkbox value="london" size="sm" className="">
              6 months/ 1 year
            </Checkbox>
            <Checkbox value="tokyo" size="sm" className="">
              + 1 year
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div> */
}
