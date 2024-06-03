import React from "react";
import { createClient } from "./../../utils/supabase/client";
import { log } from "console";
import Appart from "./appart";

export default async function page({ params }) {
  const supabase = createClient();

  const value = params.residence.replace(/_/g, " ");
  log(value);
  const { data, error } = await supabase
    .from("residence")
    .select("*")
    .eq("Description", value)
    .single();

  if (error) {
    // Handle error
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">{data && data.Description}</h1>
        {data && data.city}
      </div>

      <Appart value={data && data.id} />
    </div>
  );
}