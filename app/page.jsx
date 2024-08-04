"use client";
import React, { useState } from "react";
import MostBeauty from "@/app/mainpage/mostbeauty";
import Summer from "@/app/mainpage/summer";
import Equipment from "@/app/mainpage/equipment";
import Last from "@/app/mainpage/last";
import image2 from "@/components/image/beach2.jpg";
import image1 from "@/components/image/beach.jpg";
import { Button } from "@nextui-org/react";
import { RiHome8Line } from "react-icons/ri";
import { MdOutlinePoll } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";

function Page() {
  const [selectedCountry, setSelectedCountry] = useState("France");

  const subtitle = "font-extrabold text-xl text-center";

  return (
    <div className="w-full">
      <div className="w-full bgcolorP px-16 pb-8">
        <h1 className="text-3xl text-white pt-8">
          Existing or Project, Find Your Dream Apartment
        </h1>
        <h2 className="text-xl text-white pt-4">
        Consult information about the residential building +  Search by number of bedrooms, size, country, city, price ...
        </h2>
      
      </div>
      <div className="px-16 pt-16">
        <div className="flex flex-col justify-start items-start text-start gap-8">
          <div className="flex flex-col justify-center items-center w-full">
            <h2 className="font-bold">Select country</h2>
            <div className="w-full flex gap-4 mb-8 justify-center pt-4 ">
              <button
                onClick={() => setSelectedCountry("France")}
                className={`px-4 py-2 rounded ${
                  selectedCountry === "France"
                    ? "bgcolorS text-white borderI rounded-3xl"
                    : "bg-gray-200 borderI rounded-3xl"
                }`}
              >
                France
              </button>
              <button
                onClick={() => setSelectedCountry("Poland")}
                className={`px-4 py-2 rounded ${
                  selectedCountry === "Poland"
                    ? "bgcolorS text-white borderI rounded-3xl"
                    : "bg-gray-200 borderI rounded-3xl"
                }`}
              >
                Poland
              </button>
            </div>
          </div>
         
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle}>The Most Beautiful Existing Residences</h2>
            <MostBeauty country={selectedCountry} />
          </div>

          <div>
            <h2 className={subtitle}>
            The latest arrivals on hoomge.com
            </h2>
          </div>
          <div className="w-full">
          <Last />
          </div>
          <div
            className="relative overflow-hidden rounded-lg w-full  "
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
                <Summer />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle}>Residence with sports or relaxation facilities</h2>
            <Equipment country={selectedCountry} />
          </div>
          <div className="w-full bgcolorS rounded-xl p-8 ">
            <div className="grid grid-cols-4 grid-rows-1 gap-3">
              <div className="text-xl text-white pl-4 flex justify-center items-center">
                Your appartement get more value{" "}
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-xl">
                <div className="w-1/3  flex justify-center">
                  <RiHome8Line color="white" size="45" />
                </div>
                <div className="w-2/3">
                  <p className="text-white  flex justify-center text-center font-thin">
                    Advertisement for the sale/rental of your apartment
                  </p>
                </div>
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-xl">
                <div className="w-1/3  flex justify-center">
                  <MdOutlinePoll color="white" size="45" />
                </div>
                <div className="w-2/3">
                  <p className="text-white  flex justify-center text-center font-thin">
                    Participate in surveys for the residence
                  </p>
                </div>
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-xl">
                <div className="w-1/3  flex justify-center">
                  <LuNewspaper color="white" size="40" />
                </div>
                <div className="w-2/3">
                  <p className="text-white  flex justify-center text-center font-thin">
                    Residence information online
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-lg w-full "
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
                <Button className="bgcolorS text-white rounded-3xl borderI">
                  List your properly{" "}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
