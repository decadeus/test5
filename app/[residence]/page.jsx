"use client"
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Appart from "./appart";
import Avatar from "@/app/getimage/Ugetone";
import GoogleMaps from "./googlemap";
import Adresse from "./adresse";
import IconeS from "@/app/components/Icone";
import Map from "@/components/map";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

const FAVORITE_APARTMENTS_KEY = "favoriteApartments";

export default function Page({ params }) {
  const supabase = createClient();
  const id = params.residence; // Extracting 'id' from params
  const [apartment, setApartment] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchApartment = async () => {
      const { data, error } = await supabase
        .from("residence")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setApartment(data);
        checkIfFavorite(data?.id);
      }
    };

    fetchApartment();
  }, [id]);

  const checkIfFavorite = (apartmentId) => {
    const favoriteApartments = JSON.parse(
      localStorage.getItem(FAVORITE_APARTMENTS_KEY) || "[]"
    );
    setIsFavorite(favoriteApartments.includes(apartmentId));
  };

  const toggleFavorite = () => {
    const favoriteApartments = JSON.parse(
      localStorage.getItem(FAVORITE_APARTMENTS_KEY) || "[]"
    );

    if (isFavorite) {
      const updatedFavorites = favoriteApartments.filter(
        (apartmentId) => apartmentId !== apartment.id
      );
      localStorage.setItem(
        FAVORITE_APARTMENTS_KEY,
        JSON.stringify(updatedFavorites)
      );
      setIsFavorite(false);
    } else {
      const updatedFavorites = [...favoriteApartments, apartment.id];
      localStorage.setItem(
        FAVORITE_APARTMENTS_KEY,
        JSON.stringify(updatedFavorites)
      );
      setIsFavorite(true);
    }
  };

  if (!apartment) {
    return (
      <div className="w-full px-40 flex justify-center items-center">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full lg:px-20 md:px-10 sm:px-5 text-black">
      <div className="flex flex-col justify-center items-center w-full pb-4">
        <h1 className="text-4xl font-bold text-center px-8">{apartment.mainTitle}</h1>
      </div>
      <div className="flex flex-col justify-center md:gap-16">
        {/* Main Pictures */}
        <div className="flex flex-col items-center">
          <div className="w-full h-[400px]">
            <Avatar
              url={apartment.mainpic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        {/* Secondary Pictures and Description */}
        <div className="flex flex-col md:flex-row">
          <div className="flex justify-center items-center px-4 pb-4 md:w-1/2">
            <div className="flex flex-col gap-8">
              <p className="text-xl font-bold text-center">{apartment.t1}</p>
              <p>{apartment.d1}</p>
            </div>
          </div>
          <div className="h-[300px] md:w-1/2 md:h-[400px]">
            <Avatar
              url={apartment.secondpic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        {/* Additional Pictures and Description */}
        <div className="flex flex-col-reverse md:flex-row">
          <div className="h-[300px] md:w-1/2 md:h-[400px]">
            <Avatar
              url={apartment.threepic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
          <div className="flex justify-center items-center px-4 pb-2 md:w-1/2">
            <div className="flex flex-col gap-8">
              <p className="text-xl font-bold text-center">{apartment.t2}</p>
              <p>{apartment.d2}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Key Points */}
      <div className="justify-center flex flex-col gap-20 pt-8">
        <div className="bg-gray-200 mt-8 mb-8 py-8">
          <h2 className="font-bold text-xl text-center pb-8 pt-4">
            Key Points
          </h2>
          <div className="md:grid md:grid-cols-3 md:grid-rows-1 gap-4 flex flex-col">
            <div className="flex flex-col text-center items-center px-4 gap-2">
              <IconeS specificValue={apartment.aut1} size={30} />
              <div className="flex flex-col gap-2">
                <p className="font-bold">{apartment.taut1}</p>
                {apartment.daut1}
              </div>
            </div>
            <div className="flex flex-col text-center items-center px-4 gap-2">
              <IconeS specificValue={apartment.aut2} size={30} />
              <div className="flex flex-col gap-2">
                <p className="font-bold">{apartment.taut2}</p>
                {apartment.daut2}
              </div>
            </div>
            <div className="flex flex-col text-center items-center px-4 gap-2">
              <IconeS specificValue={apartment.aut3} size={30} />
              <div className="flex flex-col gap-2">
                <p className="font-bold">{apartment.taut3}</p>
                {apartment.daut3}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Favorite Button and Apartment Details */}
      <div className="flex justify-center items-center text-center flex-col font-bold text-xl gap-4">
        <p>Apartment Available</p>
        <Appart value={apartment.id} />
        
      </div>
      <div className="flex w-full justify-center items-center pt-16 ">
        <div className="flex border-2 p-4 justify-center items-center">
        <p className="w-full">Add to your favorite</p>
        <button
          className=" text-white px-4  rounded-lg w-fit flex justify-center items-center"
          onClick={toggleFavorite}
        >
          {isFavorite ? (
  <FaHeart fill="red" size={20} />
) : (
  <FaRegHeart fill="red" size={20} />
)}
        </button>
        </div>
        </div>
      <hr className="mt-8" />
      {/* Map and Address */}
      <div className="w-full pt-8 flex flex-col-reverse md:flex-row">
        <div className="w-full">
          <Map lnga={apartment.lng} lata={apartment.lat} classN="w-full h-[200px]" />
        </div>
        <div className="flex justify-center items-center text-center w-full">
          <Adresse
            name={apartment.mainTitle}
            adresse={apartment.adresse}
            code_postal={apartment.codepost}
            city={apartment.city}
            adresse1={apartment.adresse1}
            adresse2={apartment.adresse2}
          />
        </div>
      </div>
    </div>
  );
}
