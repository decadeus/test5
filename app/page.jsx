"use client";
import React, { useState } from "react";
import MostBeauty from "@/app/mainpage/mostbeauty";
import Summer from "@/app/mainpage/summer";
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
      {/* Header Section */}
      <div className="w-full bgcolorP px-16 pb-8">
        <h1 className="text-3xl text-white pt-8">
          Existing or Project, Find Your Dream Apartment
        </h1>
        <h2 className="text-xl text-white pt-4">
          Search by number of bedrooms, size, country, city, price ...
        </h2>
      </div>

      {/* Main Content Section */}
      <div className="px-16 pt-16">
        <div className="flex flex-col justify-start items-start text-start">
          {/* Country Selection Buttons */}
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

          {/* Recent Searches Section */}
          <div>
            <h2 className={subtitle}>
              Recent Searches for Available Residences
            </h2>
          </div>

          {/* Most Beautiful Residences Section */}
          <div className="flex flex-col justify-start items-start w-full mt-8">
            <h2 className={subtitle}>The Most Beautiful Existing Residences</h2>
            <MostBeauty country={selectedCountry} />
          </div>

          {/* Featured Image Section */}
          <div
            className="relative overflow-hidden rounded-lg w-full mt-16 "
            style={{ height: "500px" }}
          >
            {/* Background image */}
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

            {/* Background color overlay */}
            <div className="absolute inset-0 bg-slate-900/40" />

            {/* Content */}
            <div className="relative p-12 flex items-center h-full">
              <div className="flex flex-col justify-start items-start">
                <h2 className={`${subtitle} text-white`}>
                  Deal Residences: Sea and Mountain to Enjoy Nature
                </h2>
                <Summer />
              </div>
            </div>
          </div>
          <div className="w-full bgcolorS rounded-xl p-8 mt-8">
            <div className="grid grid-cols-4 grid-rows-1 gap-3">
              <div className="text-xl text-white pl-4">
                Your appartement get more value{" "}
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-xl">
                <div className="w-1/3  flex justify-center"><RiHome8Line color="white" size="45" /></div>
                <div className="w-2/3">
                <p className="text-white  flex justify-center text-center font-thin">Advertisement for the sale/rental of your apartment</p>
                </div>
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-xl">
                <div className="w-1/3  flex justify-center"><MdOutlinePoll color="white" size="45" /></div>
                <div className="w-2/3">
                <p className="text-white  flex justify-center text-center font-thin">Advertisement for the sale/rental of your apartment</p>
                </div>
              </div>
              <div className="bgcolorP flex w-full items-center py-4 px-4 rounded-xl">
                <div className="w-1/3  flex justify-center"><LuNewspaper color="white" size="45" /></div>
                <div className="w-2/3">
                <p className="text-white  flex justify-center text-center font-thin">Advertisement for the sale/rental of your apartment</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-lg w-full mt-16"
            style={{ height: "500px" }}
          >
            {/* Background image */}
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

            {/* Background color overlay */}
            <div className="absolute inset-0 bg-slate-900/40" />

            {/* Content */}
            <div className="relative p-12 flex items-center h-full">
              <div className="flex flex-col justify-start items-start">
                <h2 className="text-white text-3xl pb-8 font-bold">
                  List your property on Hoomgeand highlight <br /> the benefits
                  for residents
                </h2>
                <Button className="bgcolorS text-white rounded-3xl">
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
