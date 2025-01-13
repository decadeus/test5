"use client";

import { FaArrowRight } from "react-icons/fa";
import Form from "./form";
import { useMemo } from "react";

export default function MainPage() {
  const containerStyle =
    "flex flex-col items-center w-full px-32 pt-32 pb-32 px-4";
  const headerStyle = "text-4xl font-bold text-black text-center mb-8";
  const subheaderStyle =
    "text-lg text-black mb-8 font-montserrat mb-32 text-center";

  const stepContainerStyle = useMemo(
    () => [
      {
        step: "Step",
        title: "Fill out the form",
        para: "Start by providing the basic information about your real estate project and your professional email address. This helps us verify that you are associated with the project.",
        nb: 1,
      },
      {
        step: "Step",
        title: "Information verification",
        para: "Our team will validate the information you provided to ensure the quality of our platform and prevent abuse. This step is crucial to guarantee a reliable and secure experience.",
        nb: 2,
      },
      {
        step: "Step",
        title: "Secure access to your account",
        para: "Once your information is validated, you will receive an email with a secure link (magic link) to easily log into your account, without needing to remember a password.",
        nb: 3,
      },
      {
        step: "Step",
        title: "Add project details",
        para: "You can now enter the full details of your project: description, photos, services included in the building, and more. You can put your project online at any time.",
        nb: 4,
      },
    ],
    []
  );

  const scrollToSection = () => {
    const section = document.getElementById("formulaire");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={containerStyle}>
      <h1 className={headerStyle}>
        With Hoomge, easily and freely add your real estate project
      </h1>
      <p className={subheaderStyle}>
        Join the many real estate projects already listed on Hoomge. With our intuitive tools, you can easily find buyers by offering a streamlined search experience. Visitors can filter apartments by criteria such as surface area, number of bedrooms, services, and more.
      </p>

      {/* Steps Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-1 gap-8 w-full mb-16">
        {stepContainerStyle.map(({ step, title, para, nb }, index) => (
          <div
            key={index}
            className="relative text-white bg-gray-800 p-6 rounded-xl flex flex-col justify-between h-full group mx-4"
          >
            <div className="flex flex-col h-full justify-between">
              {/* Step Block */}
              <div className="flex items-start pb-4">
                <p className="text-sm lg:text-lg pt-4">
                  {step} {nb}
                </p>
              </div>

              {/* Title Block */}
              <div className="flex items-start pb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>

              {/* Description Block */}
              <div className="flex items-start flex-grow">
                <p className="text-base">{para}</p>
              </div>

              {/* Call to Action Button */}
              <div className="flex justify-center mt-6 mb-4">
                <button
                  onClick={scrollToSection}
                  className="bg-[#bfae9ba4] text-white py-2 px-6 rounded-lg hover:bg-[#bfae9ba4/50] transition-all duration-300"
                >
                  Start adding your project
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real Estate Project Information Section */}
      <div className="w-full flex flex-col justify-center my-8 bg-gray-100 p-8">
        <h2 className="text-3xl font-medium text-center mb-6">
          Real Estate Project Information
        </h2>
        <div className="w-full flex flex-col lg:flex-row justify-center items-center">
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <p className="px-4 text-xl text-center">
              To facilitate the search for buyers, provide the essential information about your project. Add photos, details about the services included in the building, and more. Once this information is complete, you can go live with your project.
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow-2xl mt-8 lg:mt-0 w-full lg:w-1/2">
            <img
              src="/Tab5.png"
              alt="Real estate project example"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Update Apartment List Section */}
      <div className="w-full flex flex-col bg-gray-100 p-8">
        <div className="w-full flex flex-col gap-4 justify-center items-center mb-8">
          <h2 className="text-3xl font-medium text-center">
            Update the list of apartments for sale
          </h2>
          <p className="text-xl text-center">
            At any time, you can modify the information for each apartment. If you have a large number of properties, use the search filters and sorting options to make inventory management easier.
          </p>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="bg-gray-900 rounded-xl shadow-2xl mt-8 p-4 w-full lg:w-fit flex justify-center items-center ">
            <img
              src="/Tab6.png"
              alt="Apartment management"
              className="w-[1100px] h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Project Addition Form */}
      <div id="formulaire" className="mt-4 w-full flex justify-center">
        <Form />
      </div>
    </div>
  );
}
