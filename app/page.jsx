"use client";
import React from "react";
import { createClient } from "./../utils/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Avatar from "./getimage/getone_u";
import GoogleMaps from "./[residence]/googlemap";
export default function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase.from("residence").select("*");

      if (error) console.log("error", error);
      else setTodos(data);
    }

    fetchTodos();
  }, []);

  return (
    <>
      <div className="w-full flex ">
        <div className="w-2/3 px-8">
          <ul className="flex gap-8">
            {todos.map((todo) => (
              <li key={todo.id} className="w-1/3 ">
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
                    <p className="">{todo.city}</p>
                    <p className="text-sm">A vendre:</p>
                    <p className="text-sm">A Louer:</p>
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
    </>
  );
}
