'use client';
import React from "react";
import { createClient } from "./../utils/supabase/client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from('Todo')
        .select('*');

      if (error) console.log('error', error);
      else setTodos(data);
    }

    fetchTodos();
  }, []);

  return (
    <>
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
        <Link href={`/${todo.Description.replace(/\s+/g, '_')}`}>{todo.Description}</Link>
        </li>
      ))}
    </ul>

      </>
  );
}
