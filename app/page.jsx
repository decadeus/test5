"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "./../utils/supabase/client";
import Avatar from "./getimage/Ugetone";
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
import { FaHeart } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);
  const [selected, setSelected] = useState("All");
  const [selectedB, setSelectedB] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");

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

        setTodos(filteredTodos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedB, selectedCountry, supabase]);

  const countries = [
    { id: 1, label: "All" },
    { id: 2, label: "France" },
    { id: 3, label: "Poland" },
  ];

  return (
    <div className="w-full px-4 md:px-16">
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
      <div className="w-full flex-col z-10 -mt-16 md:px-4 justify-center">
        <div className="md:px-32 flex justify-center">
          <Map
            classN="w-full md:h-[400px] h-[200px] rounded-2xl"
            todos={todos}
          />
        </div>
        <div className="w-full rounded-2xl z-10 pt-16">
          <ul className="flex flex-col gap-8 pt-8 bg-gray-200 md:p-4 rounded-2xl">
            <div className="">
              <div className=" md:justify-between justify-between flex flex-col md:flex-row items-center ">
                <div className="md:flex-row flex-col flex md:gap-32 gap-8 md:items-center w-full px-12">
                  <div className="">
                    <Select
                      placeholder="Country?"
                      className="w-[200px]"
                      selectedKey={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.label}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex justify-between md:justify-center w-full md:gap-16">
                  <div className="">
                    <RadioGroup
                      orientation="vertical"
                      value={selected}
                      onValueChange={setSelected}
                    >
                      <Radio value="All" className="text-black">
                        <p className="text-black pr-4">All</p>
                      </Radio>
                      <Radio value="Existing">
                        <p className="text-black flex gap-1 items-center pr-4">
                          {" "}
                          Existing <FaMapMarkerAlt color="red" />
                        </p>
                      </Radio>
                      <Radio value="Construction">
                        <p className="text-black flex gap-1 items-center">
                          Construction <FaMapMarkerAlt color="fuchsia" />
                        </p>
                      </Radio>
                    </RadioGroup>
                  </div>

                  <div className="">
                    <RadioGroup
                      value={selectedB}
                      onValueChange={setSelectedB}
                      orientation="vertical"
                    >
                      <Radio value="All" className="text-black">
                        <p className="text-black">All</p>
                      </Radio>
                      <Radio value="To rent">
                        <p className="text-black">To rent</p>
                      </Radio>
                      <Radio value="To sell">
                        <p className="text-black">To sell</p>
                      </Radio>
                    </RadioGroup>
                  </div>
                  </div>
                  <div className="flex md:justify-center md:items-center justify-start ">
                    <Checkbox color="danger" defaultSelected>
                      <p className="text-black">Your favorite</p>
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {todos.map((todo) => (
                <li key={todo.id} className="border bg-white rounded-2xl p-2 mx-2 mb-2">
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
                            <div className="w-[30px]">
                              <FaHeart fill="red" />
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
