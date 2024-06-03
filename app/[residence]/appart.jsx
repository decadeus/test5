"use client";
import React, { useState, useEffect} from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "./../getimage/getone";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Link from "next/link";
export default function TodoList({ value }) {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from("appartement")
        .select(`"*" , residence(*)`)
        .eq("id", value);
      if (error) {
        console.log("error", error);
      } else {
        setTodos(data);
      }
    }
    fetchTodos();
  }, [value]);

  return (
    <ul className="flex gap-8">
      {todos.map((todo) => (
        <li key={todo.id} className=" ">
       
       <Link href={`/appartement/${todo.title.replace(/\s+/g, "_")}`}>
          <Card className="py-4  border-2 border-black  hover:scale-105">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
             
            
              <h4 className="font-bold text-large">{todo.title}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
            <Avatar
            url={todo.mainpic} // Ensure this is the correct field name for the image path
            width={270}
            height={196}
          />
            </CardBody>
          </Card>
          </Link>
       
      </li>
      ))}
    </ul>
  );
}

