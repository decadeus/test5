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

  const subtitle = "font-extrabold xl:text-4xl text-2xl text-center text-white";
  const subtitle_b = "font-bold text-4xl text-black xl:text-4xl text-left mb-12";

  const grad = "bg-gradient-to-r from-fuchsia-400 via-rose-400 to-[var(--bgmap-color)] bg-clip-text text-transparent";


  useEffect(() => {
    async function fetchCounts() {
      const supabase = createClient();
      try {
        const { count: projectCount, error: projectError } = await supabase
          .from("project")
          .select("*", { count: "exact" });
        if (projectError) throw projectError;
        setCount(projectCount);

        const { count: projectListCount, error: projectListError } =
          await supabase.from("projectlist").select("*", { count: "exact" });
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
    <div className="w-full pb-8 xl:pb-32 bgfull textfull">
      <header className="w-full px-4 xl:px-16 pb-8">
        <h1 className="xl:text-6xl text-4xl font-bold textfull mb-12 mt-12 xl:mt-32 font-montserrat text-center shadowI">
          Find Your Future <br /> Dream Apartment
        </h1>
        <h2 className="text-xl textfull pt-4 text-center">
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p className="text-red-500">Une erreur est survenue : {error}</p>
          ) : (
            <>
              Search among <span className="font-bold">{count}</span> new properties
              and <span className="font-bold">{countlist}</span> listed apartments.
            </>
          )}
        </h2>
      </header>

      <main className="px-4 xl:px-64 pt-8 xl:pt-16">
        <div className="flex flex-col justify-start items-start text-start gap-8">
          {/* Section pour sélectionner le pays */}
          <div className="flex flex-col justify-center items-center w-full">
            <h2 className="font-bold textfull">Select country</h2>
            <div className="w-full flex gap-4 mb-8 justify-center pt-4 ">
              <button
                onClick={() => setSelectedCountry("France")}
                className={`px-4 py-2 rounded ${
                  selectedCountry === "France"
                    ? "bgmap borderI rounded-sm text-white"
                    : "bg-gray-200 borderI rounded-sm"
                }`}
                aria-pressed={selectedCountry === "France"}
              >
                France
              </button>
              <button
                onClick={() => setSelectedCountry("Poland")}
                className={`px-4 py-2 rounded ${
                  selectedCountry === "Poland"
                    ? "bgmap borderI rounded-sm text-white"
                    : "bg-gray-200 borderI rounded-sm"
                }`}
                aria-pressed={selectedCountry === "Poland"}
              >
                Poland
              </button>
            </div>
          </div>

          {/* Section Most Beauty */}
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle_b}>
              The Most{" "}
              <span className={grad}>
                Beautiful
              </span>{" "}
              Existing Residences
            </h2>
            <div className="w-fit">
            <MostBeauty country={selectedCountry} />
            </div>
          </div>

          {/* Section Last */}
          <div>
            <h2 className={subtitle_b}>The latest <span className={grad}>
                arrivals
              </span>  <br />on hoomge.</h2>
          </div>
          <div className="w-full">
            <Last country={selectedCountry} />
          </div>

          {/* Section Summer */}
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
              <div className="flex flex-col justify-start items-start w-full">
                <h2 className={`${subtitle} text-white mb-4`}>
                  Deal Residences: Sea and Mountain to Enjoy Nature
                </h2>
                <Summer country={selectedCountry} />
              </div>
            </div>
          </div>

          {/* Section Equipment */}
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle}>
              Residence with sports or relaxation facilities
            </h2>
            <Equipment country={selectedCountry} />
          </div>

          {/* Section Additional Features */}
          <div className="w-full bgcolorS rounded-sm p-8">
            <div className="xl:grid xl:grid-cols-4 xl:grid-rows-1 gap-3 flex flex-col ">
              <div className="text-xl textfull xl:pl-4 flex justify-center items-center">
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

          {/* Section List Your Property */}
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
                <h2 className="text-white xl:text-3xl text-2xl pb-8 font-bold">
                  List your property on Hoomge and highlight <br /> the benefits
                  for residents
                </h2>
                <Button className="bgmap hover:bg-blue-700 text-white rounded-sm borderI">
                  List your property
                </Button>
              </div>
            </div>
          </div>

          {/* Section List Companies */}
          <div className="flex flex-col justify-start items-start w-full">
            <h2 className={subtitle_b}>Property Management Companies</h2>
            <ListCompanies />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
