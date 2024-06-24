"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "./../utils/supabase/client";
import Avatar from "./getimage/Ugetone";
import GoogleMaps from "./[residence]/googlemap";

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
        const countVendre = residenceApartments.filter(apt => apt.type === 'Vendre').length;
        const countLouer = residenceApartments.filter(apt => apt.type === 'Louer').length;
        
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
    <div className="w-full flex">
      <div className="w-2/3 px-8">
        <ul className="flex gap-8">
          {todos.map((todo) => (
            <li key={todo.id} className="w-1/3">
              <Link href={`/${todo.id}`}>
                <div className="aspect-square">
                  <Avatar
                    url={todo.mainpic_url}
                    width={270}
                    height={196}
                    classn="rounded-2xl"
                  />
                </div>
                <div className="flex flex-col gap-0 pt-2">
                  <p className="font-bold">{todo.mainTitle}</p>
                  <p>{todo.city}</p>
                  <p className="text-sm">A vendre: {todo.countVendre}</p>
                  <p className="text-sm">A Louer: {todo.countLouer}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/3">
        <GoogleMaps
          lata="-9.069839810859907"
          lnga="39.60128890889341"
          height="h-full"
        />
      </div>
    </div>
  );
}
