'use client';
import React from "react";
import { createClient } from "./../utils/supabase/client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

import { Button } from "@nextui-org/react";

export default function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase.from("Todo").select("*");


      if (error) console.log('error', error);
      else setTodos(data);
    }

    fetchTodos();
  }, []);

  return (
    <>
     <ul className="flex gap-8">
        {todos.map((todo) => (
          <li key={todo.id} className=" ">
            <Link href={`/${todo.Description.replace(/\s+/g, "_")}`}>
              <Card className="py-4  border-2 border-black  hover:scale-105">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold text-red-700">
                    {todo.Description}
                  </p>
                  <small className="text-default-500">12 Tracks</small>
                  <h4 className="font-bold text-large">Frontend Radio</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src="https://nextui.org/images/hero-card-complete.jpeg"
                    width={270}
                  />
                </CardBody>
              </Card>

            </Link>
          </li>
        ))}
      </ul>
    </>

  );
}
