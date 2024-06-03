import React from "react";
import { createClient } from "@/utils/supabase/client";
import { log } from "console";


export default async function page({ params }) {
  const supabase = createClient();

  const value = params.appartement.replace(/_/g, " ");
  log(value);
  const { data, error } = await supabase
    .from("appartement")
    .select("*")
    .eq("title", value)
    .single();

  if (error) {
    // Handle error
  }

  return (
    <div>
     {data && data.title}

    </div>
  );
}