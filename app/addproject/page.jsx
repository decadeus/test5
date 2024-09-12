import React from "react";
import Form from "@/app/addproject/form";
import d from "@/components/d.png";
import e from "@/components/e.png";
import Image from "next/legacy/image";

export default function Page() {
  // Styles for a modern design
  const containerStyle =
    "flex flex-col items-center bgfull w-full px-64 pt-32 pb-32";
  const headerStyle =
    "text-6xl font-bold text-gray-100 mb-8 font-montserrat text-center shadowI bg-transparent";
  const subheaderStyle = "text-lg text-gray-100 mb-8 font-montserrat mb-32";
  const stepContainerStyle =
    "flex flex-col md:flex-row items-center justify-center gap-6 mb-8 ";
  const stepStyle =
    "bgcolorS text-white font-semibold p-4 rounded-full shadow-lg w-12 h-12 flex items-center justify-center text-2xl font-montserrat";
  const contentStyle =
    "bg-white shadow-lg rounded-sm p-6 w-full md:w-3/4 lg:w-1/2";
  const titleStyle = "text-2xl font-bold text-gray-800 mb-2";
  const textStyle = "text-gray-600 font-montserrat";
  const stepItemStyle =
    "flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-sm shadow-md";

  const bgc =
    "linear-gradient(338deg, rgba(160,45,207,1) 16%, rgba(92,0,157,1) 100%);";

  return (
    <div className={containerStyle}>
      <h1 className={headerStyle}>
        The Largest Collection of <br /> Residential Real Estate Projects
      </h1>
      <p className={subheaderStyle}>
        List Your Residential Apartments for Sale in Minutes, Completely Free.
      </p>
      <button className="bg-blue-500 text-white py-2 px-4 text-xl mb-16">Add your project</button>
      <div className="flex flex-col justify-start items-start w-full mb-16">
        <p className="text-gray-300 mb-4">Building</p>
        <h2 className="text-white text-5xl font-bold mb-8">
          Fill information about{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 via-pink-500 to-sky-500 bg-clip-text text-transparent">
            the building{" "}
          </span>
        </h2>
        <p className="text-gray-400 text-xl mb-20">
        Present the advantages of the residence by highlighting and selecting specific features to facilitate the apartment search. Once all the information is provided, you can immediately list your available apartments for sale online.
          </p>
        <div className="w-[450px] shadowW">
          <Image src={d} width={450} height={450} alt="Logo" className="" />
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-full mb-16">
        <p className="text-gray-300 mb-4">Apartements</p>
        <h2 className="text-white text-5xl font-bold mb-8">
          Fill information about{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 via-pink-500 to-sky-500 bg-clip-text text-transparent">
            the apartements{" "}
          </span>
        </h2>
        <p className="text-gray-400 text-xl mb-20">
        Fill in the information for each apartment. You can specify a price or choose not to publish it. Update the information at any time.
          </p>
        <div className=" relative w-[670px] shadowW">
          <Image src={e}  layout="fill"
          objectFit="cover" alt="Logo" className="" />
        </div>
      </div>
     
      <Form />
    </div>
  );
}
