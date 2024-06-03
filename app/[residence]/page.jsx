import React from "react";
import { createClient } from "@/utils/supabase/server";
import Appart from "./appart";
import Avatar from "@/app/getimage/getone";

export default async function Page({ params }) {
  const supabase = createClient();
  const id = params.residence; // Extracting 'id' from params

  const { data, error } = await supabase
    .from("residence")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="w-full px-40 flex justify-center items-center">
        <h1 className="text-4xl font-bold">Error loading data</h1>
      </div>
    );
  }

  return (
    <div className="w-full lg:px-20 md:px-10 sm:px-5">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl font-bold">{data?.Description}</h1>
        <p>{data?.city}</p>
      </div>
      <div className="flex flex-col gap-20 justify-center">
        <div className="flex flex-col items-center">
          <div className="w-full h-[600px]">
            <Avatar
              url={data?.mainpic}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex w-1/2 justify-center items-center">
            <div className="flex flex-col gap-8">
              <p className="text-2xl font-bold">{data.t1}</p>
              <p>{data.d1}</p>
            </div>
          </div>
          <div className="w-1/2 h-[400px]">
            <Avatar
              url={data?.mainpic}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="w-1/2 h-[400px]">
            <Avatar
              url={data?.i1}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <div className="flex flex-col gap-8">
              <p className="text-2xl font-bold">{data.t2}</p>
              <p className="">{data.d2}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-2 flex justify-center items-center text-center">
        <Appart value={data?.id} />
      </div>
     
    </div>
  );
}