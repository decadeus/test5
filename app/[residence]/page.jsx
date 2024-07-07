import React from "react";
import { createClient } from "@/utils/supabase/server";
import Appart from "./appart";
import Avatar from "@/app/getimage/Ugetone";
import GoogleMaps from "./googlemap";
import Adresse from "./adresse";
import IconeS from "@/app/components/Icone"; // Ensure correct path
import Map from "@/components/map"

export default async function Page({ params }) {
  const supabase = createClient();
  const id = params.residence; // Extracting 'id' from params
  const iconee = "flex flex-col text-center items-center px-4 gap-2";
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
    <div className="w-full lg:px-20 md:px-10 sm:px-5 text-black">
      <div className="flex flex-col justify-center items-center w-full pb-4">
        <h1 className="text-4xl font-bold text-center px-8 ">{data?.mainTitle}</h1>
      </div>
      <div className="flex flex-col justify-center md:gap-16">
        <div className="flex flex-col items-center">
          <div className="w-full h-[400px]">
            <Avatar
              url={data?.mainpic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row ">
          <div className="flex justify-center items-center px-4 pb-4 md:w-1/2">
            <div className="flex flex-col gap-8 ">
              <p className="text-xl font-bold text-center">{data.t1}</p>
              <p>{data.d1}</p>
            </div>
          </div>
          <div className="h-[300px] md:w-1/2 md:h-[400px]">
            <Avatar
              url={data?.secondpic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-8 md:flex-row ">
          <div className=" h-[300px] md:w-1/2 md:h-[400px]">
            <Avatar
              url={data?.threepic_url}
              width={2000}
              height={600}
              className="rounded-lg"
            />
          </div>
          <div className="flex justify-center items-center px-4 pb-2 md:w-1/2">
            <div className="flex flex-col gap-8">
              <p className="text-xl font-bold text-center">{data.t2}</p>
              <p >{data.d2}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="justify-center flex flex-col gap-20 ">
        <div className=" bg-gray-200 mt-8 mb-8 py-8 px-8">
          <h2 className="font-bold text-xl text-center  pb-8 pt-4">
          the key points
          </h2>
          <div className="md:grid md:grid-cols-3 md:grid-rows-1 gap-4 flex flex-col">
            <div className={iconee}>
              <IconeS specificValue={data?.aut1} size={30} />
              <div className="flex flex-col gap-2">
                <p className="font-bold">{data?.taut1}</p>
                {data?.daut1}
              </div>
            </div>
            <div className={iconee}>
              <IconeS specificValue={data?.aut2} size={30} />
              <div className="flex flex-col gap-2">
                <p className="font-bold">{data?.taut2}</p>
                {data?.daut2}
              </div>
            </div>
            <div className={iconee}>
              <IconeS specificValue={data?.aut3} size={30} />
              <div className="flex flex-col gap-2">
                <p className="font-bold">{data?.taut3}</p>
                {data?.daut3}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center text-center flex-col font-bold text-xl gap-4 ">
        <p>apartment available</p>
        <Appart value={data?.id} />
      </div>
      <hr className="mt-8" />

      <div className="w-full pt-8 flex flex-col-reverse md:flex-row">
        <div className="">
          
          <Map lnga={data?.lat} lata={data?.lng}  /> 
        </div>
        <div className=" flex justify-center items-center text-center w-full">
          <Adresse
            name={data?.mainTitle}
            adresse={data?.adresse}
            code_postal={data?.codepost}
            city={data?.city}
            adresse1={data?.adresse1}
            adresse2={data?.adresse2}
          />
        </div>
      </div>
    </div>
  );
}
