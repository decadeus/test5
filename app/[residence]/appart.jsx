"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "../getimage/Ugetone";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function TodoList({ value }) {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from("appartement")
        .select(`"*" , residence(*)`)
        .eq("ida", value);
      if (error) {
        console.log("error", error);
      } else {
        setTodos(data);
      }
    }
    fetchTodos();
  }, [value]);

  return (
    <>
      
      <ul className="flex gap-4 flex-wrap ">
        {todos.map((todo) => (
          <li key={todo.id} className="text-black ">
            <Link href={`${pathname}/${todo.id}`}>
              <Card className="py-4  border-2 border-black  hover:scale-105 shadow-xl">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            

                  <h4 className="font-bold text-large text-black">{todo.type}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2 w-[150px] h-[150px] ">
                  <Avatar url={todo.mainpic_url} width={270} height={196} />
                </CardBody>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
