"use client";
import React, { useState, useEffect } from "react";
import MostBeauty from "@/app/mainpage/mostbeauty";
import Summer from "@/app/mainpage/summer";
import Equipment from "@/app/mainpage/equipment";
import Last from "@/app/mainpage/last";
import ListCompanies from "@/app/mainpage/listcompanie";
import image2 from "@/components/image/beach2.jpg";
import image1 from "@/components/image/beach.jpg";
import { Button } from "@nextui-org/react";
import { RiHome8Line } from "react-icons/ri";
import { MdOutlinePoll } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";
import { createClient } from "@/utils/supabase/client";

function Page() {
  const [selectedCountry, setSelectedCountry] = useState("France");
  const [count, setCount] = useState(null);
  const [countlist, setCountList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subtitle = "font-extrabold text-4xl text-center text-white";
  const subtitle_b = "font-extrabold text-4xl text-center text-black";

  useEffect(() => {
    async function fetchCounts() {
      const supabase = createClient();
      try {
        // Fetch count for 'project'
        const { count: projectCount, error: projectError } = await supabase
          .from('project')
          .select('*', { count: 'exact' });

        if (projectError) throw projectError;

        setCount(projectCount);

        // Fetch count for 'projectlist'
        const { count: projectListCount, error: projectListError } = await supabase
          .from('projectlist')
          .select('*', { count: 'exact' });

        if (projectListError) throw projectListError;

        setCountList(projectListCount);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return (
    <div className="w-full pb-32 bgfull textfull">
     
      <div className="w-full px-16 pb-8">
        <h1 className="text-6xl font-bold textfull mb-12 mt-32 font-montserrat text-center shadowI ">
          Find Your Future <br /> Dream Apartment
        </h1>
        <h2 className="text-xl textfull pt-4 text-center">
          Search among {count} new properties and {countlist} listed apartments.
        </h2>
      </div>
      <div className="px-64 pt-16 ">
        <div className="flex flex-col justify-start items-start text-start gap-8">
          <div className="flex flex-col justify-center items-center w-full">
            <h2 className="font-bold textfull">Select country</h2>
            <div className="w-full flex gap-4 mb-8 justify-center pt-4 ">
              <button
                onClick={() => setSelectedCountry("France")}
                className={`px-4 py-2 rounded ${
                  selectedCountry === "France"
                    ? "bgmap textfull borderI rounded-sm"
                    : "bg-gray-200 borderI rounded-sm"
                }`}
              >
                France
              </button>
              <button
                onClick={() => setSelectedCountry("Poland")}
                className={`px-4 py-2 rounded ${
                  selectedCountry === "Poland"
                    ? "bgmap textfull borderI rounded-sm"
                    : "bg-gray-200 borderI rounded-sm"
                }`}
              >
                Poland
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle_b}>
              The Most{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-500 to-sky-500 bg-clip-text text-transparent">
                Beautiful
              </span>{" "}
              Existing Residences
            </h2>
            <MostBeauty country={selectedCountry} />
          </div>
          <div>
            <h2 className={subtitle_b}>The latest arrivals on hoomge.com</h2>
          </div>
          <div className="w-full">
            <Last country={selectedCountry} />
          </div>
          <div
            className="relative overflow-hidden rounded-sm w-full"
            style={{ height: "500px" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${image2.src})`,
                backgroundPosition: "center bottom",
                backgroundSize: "cover",
              }}
              role="img"
              aria-label="Beach background"
            />
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="relative p-12 flex items-center h-full">
              <div className="flex flex-col justify-start items-start">
                <h2 className={`${subtitle} text-white`}>
                  Deal Residences: Sea and Mountain to Enjoy Nature
                </h2>
                <Summer country={selectedCountry} />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle}>Residence with sports or relaxation facilities</h2>
            <Equipment country={selectedCountry} />
          </div>
          <div className="w-full bgcolorS rounded-sm p-8 ">
            <div className="grid grid-cols-4 grid-rows-1 gap-3">
              <div className="text-xl textfull pl-4 flex justify-center items-center">
                Your apartment gets more value{" "}
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-sm">
                <div className="w-1/3 flex justify-center">
                  <RiHome8Line color="white" size="45" />
                </div>
                <div className="w-2/3">
                  <p className="text-white flex justify-center text-center font-thin">
                    Advertisement for the sale/rental of your apartment
                  </p>
                </div>
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-sm">
                <div className="w-1/3 flex justify-center">
                  <MdOutlinePoll color="white" size="45" />
                </div>
                <div className="w-2/3">
                  <p className="text-white flex justify-center text-center font-thin">
                    Participate in surveys for the residence
                  </p>
                </div>
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-sm">
                <div className="w-1/3 flex justify-center">
                  <LuNewspaper color="white" size="40" />
                </div>
                <div className="w-2/3">
                  <p className="text-white flex justify-center text-center font-thin">
                    Residence information online
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-sm w-full"
            style={{ height: "500px" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${image1.src})`,
                backgroundPosition: "center bottom",
                backgroundSize: "cover",
              }}
              role="img"
              aria-label="Beach background"
            />
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="relative p-12 flex items-center h-full">
              <div className="flex flex-col justify-start items-start">
                <h2 className="text-white text-3xl pb-8 font-bold">
                  List your property on Hoomge and highlight <br /> the benefits
                  for residents
                </h2>
                <Button className="bgmap hover:bg-blue-700 text-white rounded-sm borderI">
                  List your property
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle}>Property Management Companies</h2>
           
          </div>
          <ListCompanies />
        </div>
      </div>
    </div>
  );
}

export default Page;
