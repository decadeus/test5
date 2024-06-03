"use client";
import React from "react";
import { createClient } from "./../utils/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody} from "@nextui-org/react";
import Avatar from "./getimage/getone";

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
      <ul className="flex gap-8">
        {todos.map((todo) => (
          <li key={todo.id} className=" ">
            <Link href={`/${todo.id}`}>
              <Card className="py-4  border-2 border-black  hover:scale-105">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold text-red-700">
                    {todo.Description}
                  </p>
                  <small className="text-default-500">{todo.city}</small>
                  <h4 className="font-bold text-large">Frontend Radio</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2 h-[100px]">
                  <Avatar url={todo.mainpic}
                   width={270} height={196} />
                </CardBody>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}