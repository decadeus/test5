"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "./../utils/supabase/client";
import Avatar from "./getimage/Ugetone";
import GoogleMaps from "./[residence]/googlemap";
import Map from "@/components/map"

export default function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: residences, error: residenceError } = await supabase.from("residence").select("*");
      if (residenceError) {
        console.log("error", residenceError);
        return;
      }

      // Fetch apartments and associate them with residences
      const { data: apartments, error: apartmentError } = await supabase.from("appartement").select("type, ida");
      if (apartmentError) {
        console.log("error", apartmentError);
        return;
      }

      // Combine residences with their associated apartments
      const residencesWithCounts = residences.map(residence => {
        const residenceApartments = apartments.filter(apt => apt.ida === residence.id);
        const countVendre = residenceApartments.filter(apt => apt.type === 'To sell').length;
        const countLouer = residenceApartments.filter(apt => apt.type === 'To rent').length;
        
        return {
          ...residence,
          countVendre,
          countLouer
        };
      });

      setTodos(residencesWithCounts);
    }

    fetchData();
  }, []);

  return (
    <div className="w-full flex-col">
       
      <div className=" w-full px-4">
        <ul className="flex flex-col md:flex-row md:flex-wrap md:justify-evenly gap-8 ">
          {todos.map((todo) => (
            
            <li key={todo.id} className=" justify-center">
              <Link href={`/${todo.id}`}>
              <div className="flex gap-4 md:flex-col">
                <div className="aspect-square w-1/2 md:w-[300px]">
                  <Avatar
                    url={todo.mainpic_url}
                    width={270}
                    height={196}
                    classn="rounded-2xl"
                  />
                </div>
                <div className="flex flex-col gap-0 pt-2 w-1/2">
                  <p className="font-bold">{todo.mainTitle}</p>
                  <p>{todo.city}</p>
                  <p className="text-sm">To sell: {todo.countVendre}</p>
                  <p className="text-sm">To rent: {todo.countLouer}</p>
                </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
     
      <div className="w-full lg:w:1/3">
        <GoogleMaps
          lata="-9.069839810859907"
          lnga="39.60128890889341"
          height="h-full"
        />
      </div>
    </div>
  );
}
