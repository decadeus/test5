import React from "react";
import { createClient } from "./../../utils/supabase/server";
import { cookies } from "next/headers";

export default async function Name() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("Todo")
    .select("Description")
    .eq("id", 2)
    .single();

  return (
    <>
      <p>{data.Description}</p>
    </>
  );
}