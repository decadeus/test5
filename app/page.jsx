"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "./../utils/supabase/client";
import Avatar from "./getimage/Ugetone";
import Map from "@/components/fullmap";
import Image from "next/image";
import image from "@/components/image/appart3.jpg";
import { RadioGroup, Radio, Checkbox } from "@nextui-org/react";
import { FaHeart } from "react-icons/fa";

export default function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);
  const [selected, setSelected] = useState("All");
  const [selectedB, setSelectedB] = useState("All");

  useEffect(() => {
    // Function to fetch data from Supabase
    const fetchData = async () => {
      try {
        const [residenceResponse, apartmentResponse] = await Promise.all([
          supabase.from("residence").select("*"),
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

        // Combine residences with their associated apartments
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

        // Apply filters based on selected radio buttons
        const filteredTodos = residencesWithCounts.filter((residence) => {
          if (selectedB === "To sell") {
            return residence.countVendre > 0;
          } else if (selectedB === "To rent") {
            return residence.countLouer > 0;
          }
          return true;
        });

        setTodos(filteredTodos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedB, supabase]);

  return (
    <div className="w-full px-8 md:px-32">
      <div className="flex justify-center w-full h-[300px] z-0 rounded-2xl relative">
        <div
          className="relative overflow-hidden rounded-lg bg-cover bg-no-repeat p-12  w-full"
          style={{
            backgroundImage: `url(${image.src})`,
            height: "400px",
          }}
        >
          <p className="text-white font-bold text-3xl">Find your dream apartment <br/> and residence</p>
        </div>
      </div>
      <div className="w-full flex z-10 -mt-16 justify-center px-16">
        <div className="w-2/3 px-4 md:px-16 rounded-2xl z-10">
          <ul className="flex flex-col gap-8 pt-8 bg-gray-200 p-4 rounded-2xl">
            <div className="flex justify-between px-8">
            <div className="">
              <RadioGroup
              orientation="horizontal"
                value={selected}
                onValueChange={setSelected}
              >
                <Radio value="All" className="text-black">
                  <p className="text-black">All</p>
                </Radio>
                <Radio value="Existing">
                  <p className="text-black">Existing</p>
                </Radio>
                <Radio value="Construction">
                  <p className="text-black">Construction</p>
                </Radio>
              
              </RadioGroup>
             
            </div>
            <div className="">
              <RadioGroup
                value={selectedB}
                onValueChange={setSelectedB}
                orientation="horizontal"
                color="text-black"
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
            <div className="flex justify-center">
            <Checkbox color="danger" defaultSelected><p className="text-black">Your favorite</p></Checkbox>
            </div>
            {todos.map((todo) => (
              <li key={todo.id} className="border bg-white p-4 rounded-2xl">
                <div className="flex">
                <div className="w-full">
                <Link href={`/${todo.id}`}>
                  <div className="flex gap-4">
                    <div className="w-1/2 h-36">
                      <Avatar
                        url={todo.mainpic_url}
                        width={270}
                        height={196}
                        classn="rounded-2xl"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-1/2">
                      <p className="font-bold">{todo.mainTitle}</p>
                      <p>{todo.city}</p>
                      <p className="text-sm">To sell: {todo.countVendre}</p>
                      <p className="text-sm">To rent: {todo.countLouer}</p>
                    </div>
                    
                  </div>
                  
                </Link>
                </div>
                <div className="w-[30px]">
                <FaHeart fill="red" />
                </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/3">
          <Map classN="w-full h-[400px] rounded-2xl" todos={todos} />
        </div>
      </div>
    </div>
  );
}
