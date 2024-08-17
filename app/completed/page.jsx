"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/Ugetone";
import Map from "@/components/fullmap";
import Image from "next/image";
import image from "@/components/image/appart3.jpg";
import {
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaHeart, FaKey } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa6";
import { BsBuildingFillGear } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import dynamic from "next/dynamic";


const FAVORITE_TODOS_KEY = "favoriteApartments";

const LazyMap = dynamic(() => import("@/app/map/index"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});


export default function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);
  const [selected, setSelected] = useState("All");
  const [selectedB, setSelectedB] = useState("All");
  const [selectedC, setSelectedC] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [favoriteTodos, setFavoriteTodos] = useState(() => {
    // Retrieve from localStorage on component mount
    const storedFavorites = localStorage.getItem(FAVORITE_TODOS_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let residenceQuery = supabase.from("residence").select("*");

        if (selectedCountry !== "All") {
          residenceQuery = residenceQuery.eq("country", selectedCountry);
        }

        const [residenceResponse, apartmentResponse] = await Promise.all([
          residenceQuery,
          supabase.from("appartement").select("type, ida"),
        ]);

        const { data: residences, error: residenceError } = residenceResponse;
        const { data: apartments, error: apartmentError } = apartmentResponse;

        if (residenceError) {
          console.error("Error fetching residences:", residenceError);
          return;
        }

        if (apartmentError) {
          console.error("Error fetching apartments:", apartmentError);
          return;
        }

        const residencesWithCounts = residences.map((residence) => {
          const residenceApartments = apartments.filter(
            (apt) => apt.ida === residence.id
          );
          const countVendre = residenceApartments.filter(
            (apt) => apt.type === "To sell"
          ).length;
          const countLouer = residenceApartments.filter(
            (apt) => apt.type === "To rent"
          ).length;

          return {
            ...residence,
            countVendre,
            countLouer,
          };
        });

        const filteredTodos = residencesWithCounts.filter((residence) => {
          if (selectedB === "To sell" && residence.countVendre === 0) {
            return false;
          }
          if (selectedB === "To rent" && residence.countLouer === 0) {
            return false;
          }
          return true;
        });
        const finalFilteredTodos = showOnlyFavorites
          ? filteredTodos.filter((residence) =>
              favoriteTodos.includes(residence.id)
            )
          : filteredTodos;

        setTodos(finalFilteredTodos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    selectedB,
    selectedC,
    selectedCountry,
    supabase,
    favoriteTodos,
    showOnlyFavorites,
  ]);
  const toggleShowOnlyFavorites = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  const countries = [
    { id: 1, label: "All" },
    { id: 2, label: "France" },
    { id: 3, label: "Poland" },
  ];

  return (
    <div className="w-full px-4 md:px-16 flex flex-col justify-center gap-8 pt-8">
        
      <div className="md:flex-row flex flex-col justify-center items-center gap-4">
    
        <div className="border-black border-2 md:w-fit w-full flex rounded-xl flex-col md:flex-row justify-center gap-4">
          <div>
            <Select
              size="md"
              label={<FaMapPin className="txcolorP" size={20} />}
              labelPlacement="outside"
              isMultiline={true}
              placeholder="Country"
              selectedKey={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{ backgroundColor: "transparent" }} // Style inline pour rendre l'arrière-plan transparent
              className="md:w-[200px] w-full flex items-center custom-select"
            >
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.label}>
                  {country.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <Select
              labelPlacement="outside"
              style={{ backgroundColor: "transparent" }}
              isMultiline={true}
              label={<BsBuildingFillGear className="txcolorP" size={20} />}
              value={selectedC}
              placeholder="Status"
              onChange={(e) => setSelectedC(e.target.value)}
              className="md:w-[200px] w-full flex items-center"
            >
              <SelectItem key="All">All</SelectItem>
              <SelectItem key="Available">Available</SelectItem>
              <SelectItem key="Project">Project</SelectItem>
            </Select>
          </div>

          {selectedB === "Project" ||
            ("All" && (
              <div>
                <Select
                  labelPlacement="outside"
                  style={{ backgroundColor: "transparent" }}
                  isMultiline={true}
                  label={<FaKey className="txcolorP" size={20} />}
                  value={selectedB}
                  placeholder="Type"
                  onChange={(e) => setSelectedB(e.target.value)}
                  className="md:w-[200px] w-full flex items-center"
                >
                  <SelectItem key="All">All</SelectItem>
                  <SelectItem key="To rent">To rent</SelectItem>
                  <SelectItem key="To sell">To sell</SelectItem>
                </Select>
              </div>
            ))}
        </div>
        <div
          className="border-black border-2 w-fit rounded-xl 
          gap-4 py-2 px-4 md:ml-16"
        >
          <div className="flex gap-4">
            <Checkbox
              isSelected={showOnlyFavorites}
              isIconOnly
              variant="bordered"
              color="danger"
              icon={<FaHeart />}
              onChange={toggleShowOnlyFavorites}
            >
              All Favorites
            </Checkbox>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full h-[300px] z-0 rounded-2xl relative">
        <div
          className="relative overflow-hidden rounded-lg bg-cover bg-no-repeat p-12 w-full"
          style={{
            backgroundImage: `url(${image.src})`,
            height: "400px",
          }}
        >
          <p className="text-white font-bold text-3xl">
            Find your dream apartment <br /> and residence
          </p>
        </div>
      </div>
      <div className="w-full flex-col z-10 -mt-32 md:px-4 justify-center">
        <div className="md:px-32 flex justify-center">
          <LazyMap />
        </div>
        <div className="w-full rounded-2xl z-10 pt-16">
      

          <ul className="flex flex-col gap-8 pt-8 bg-gray-200 md:p-4 rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="border bg-white rounded-2xl p-2 mx-2 mb-2 shadow-xl"
                >
                  <div className="flex ">
                    <div className="w-full">
                      <Link href={`/${todo.id}`}>
                        <div className="flex-col gap-4 ">
                          <div className="h-36">
                            <Avatar
                              url={todo.mainpic_url}
                              width={270}
                              height={196}
                              classn="rounded-2xl"
                            />
                          </div>
                          <div className="flex w-full justify-between pt-4">
                            <div className="flex flex-col">
                              <p className="font-bold">{todo.mainTitle}</p>
                              <div className="flex gap-2">
                                <p>{todo.adresse1},</p>
                                <p>{todo.city}</p>
                              </div>
                              <div className="flex gap-2 items-center">
                                <p className="text-sm">
                                  To sell: {todo.countVendre}
                                </p>
                                <p className="text-bold text-xl">.</p>
                                <p className="text-sm">
                                  To rent: {todo.countLouer}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              {favoriteTodos.includes(todo.id) ? (
                                <FaHeart style={{ color: "red" }} size={20} />
                              ) : (
                                <FaRegHeart
                                  style={{ color: "red" }}
                                  size={20}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
