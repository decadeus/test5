'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox, CheckboxGroup, Slider } from '@nextui-org/react';
import Image from 'next/image';
import a from '@/components/image/appart1.jpg';
import { createClient } from '@/utils/supabase/client';
import { FaBed, FaEuroSign } from 'react-icons/fa';
import { SlSizeFullscreen } from 'react-icons/sl';
import { TbCurrencyZloty } from 'react-icons/tb';
import Map from '@/components/fullmap';

function Page() {
  const [projects, setProjects] = useState([]);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState(['France', 'Poland']);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [surfaceRange, setSurfaceRange] = useState([0, 200]);
  const [bedRange, setBedRange] = useState([0, 10]);

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projectlist')
      .select('*, project(*, lat, lng, mainpic_url)');

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
        project.bed <= bedRange[1]
    );
  }, [originalProjects, selectedCountries, priceRange, surfaceRange, bedRange]);

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

  if (loading) {
    return <div>Loading...</div>; // Consider a spinner here
  }

  if (error) {
    return (
      <div>
        Error fetching data: {error.message}
        <button onClick={fetchProjects}>Retry</button>
      </div>
    );
  }

  const fiche = 'pb-2 flex';
  return (
    <div className='flex flex-col w-full px-16'>
      <Filter
        selectedCountries={selectedCountries}
        onCountryChange={handleCountryChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        surfaceRange={surfaceRange}
        onSurfaceRangeChange={handleSurfaceRangeChange}
        bedRange={bedRange}
        onBedRangeChange={handleBedRangeChange}
      />
      <div className='w-full flex'>
        <div className='w-3/6'>
          <div className='flex-col flex gap-4'>
            {projects.map((item, index) => (
              <div key={index} className={fiche}>
                <div className='relative h-40 w-2/3'>
                  <Image
                    src={item.mainpic_url || a}
                    layout='fill'
                    objectFit='cover'
                    alt='Project Image'
                  />
                </div>
                <div className='px-2 pt-2 flex w-1/3'>
                  <div className='flex flex-col gap-2'>
                    <p className='flex gap-2 items-center'>
                      {item.pricetype === 'PLN' ? (
                        <>
                          <TbCurrencyZloty size={20} /> {item.price}
                        </>
                      ) : (
                        <>
                          <FaEuroSign /> {item.price}
                        </>
                      )}
                    </p>
                    <p className='flex gap-2 items-center'>
                      <SlSizeFullscreen size={15} /> {item.surface} m²
                    </p>
                    <p className='flex gap-2 items-center'>
                      <FaBed size={20} /> {item.bed}
                    </p>
                    <p>{item.project.city}</p>
                    <p>{item.project.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='w-3/6'>
          <Map
            classN='w-full md:h-[400px] h-[200px] rounded-2xl'
            todos={projects}
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
  priceRange,
  onPriceRangeChange,
  surfaceRange,
  onSurfaceRangeChange,
  bedRange,
  onBedRangeChange,
}) {
  const htwo = 'text-sm font-bold';

  return (
    <div className='grid grid-cols-4 grid-rows-1 gap-3 pb-8'>
      <div className='flex flex-col gap-2'>
        <h2 className={htwo}>Country</h2>
        <CheckboxGroup
          value={selectedCountries}
          onChange={onCountryChange}
          color='secondary'
          orientation='horizontal'
          aria-label='Country'
        >
          <Checkbox value='France'>France</Checkbox>
          <Checkbox value='Poland'>Poland</Checkbox>
        </CheckboxGroup>
      </div>

      <div className='flex flex-col gap-2'>
        <h2 className={htwo}>Price range</h2>
        <Slider
          min={0}
          maxValue={1000000}
          step={1}
          value={priceRange}
          onChange={onPriceRangeChange}
          range
          className='max-w-md'
          color='secondary'
          aria-label='Price range'
        />
        <div className='flex justify-between'>
          <p className='text-default-500 font-medium text-small'>
            Selected price: {priceRange[0]} – {priceRange[1]}
          </p>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <p className={htwo}>Surface</p>
        <Slider
          min={0}
          maxValue={200}
          step={1}
          value={surfaceRange}
          onChange={onSurfaceRangeChange}
          range
          className='max-w-md'
          color='secondary'
          aria-label='Surface'
        />
        <div className='flex justify-between'>
          <p className='text-default-500 font-medium text-small'>
            Selected surface: {surfaceRange[0]} – {surfaceRange[1]}
          </p>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <p className={htwo}>Number of bedrooms</p>
        <Slider
          min={0}
          maxValue={10}
          step={1}
          value={bedRange}
          onChange={onBedRangeChange}
          range
          className='max-w-md'
          color='secondary'
          aria-label='Number of bedrooms'
        />
        <div className='flex justify-between'>
          <p className='text-default-500 font-medium text-small'>
            Selected bedrooms: {bedRange[0]} – {bedRange[1]}
          </p>
        </div>
      </div>
    </div>
  );
}
