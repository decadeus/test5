"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "./../getimage/getone";

export default function TodoList({ value }) {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from("appartement")
        .select("*")
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
        <li key={todo.ide}>
          <p>{todo.ide}</p>
         <p> {todo.title}</p>
         <p>{todo.mainpic}</p>
          <Avatar
            url={todo.mainpic} // Ensure this is the correct field name for the image path
            width={1000}
            height={196}
          />
        </li>
      ))}
    </ul>
  );
}