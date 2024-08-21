import React from "react";
import Form from "@/app/addproject/form";

export default function Page() {
  // Styles for a modern design
  const containerStyle =
    "flex flex-col items-center bg-gray-50 w-full px-16 pt-32 pb-32";
  const headerStyle = "text-3xl font-extrabold text-gray-900 mb-4 font-montserrat";
  const subheaderStyle = "text-lg text-gray-600 mb-8 font-montserrat";
  const stepContainerStyle =
    "flex flex-col md:flex-row items-center justify-center gap-6 mb-8";
  const stepStyle =
    "bgcolorS text-white font-semibold p-4 rounded-full shadow-lg w-12 h-12 flex items-center justify-center text-2xl font-montserrat";
  const contentStyle =
    "bg-white shadow-lg rounded-lg p-6 w-full md:w-3/4 lg:w-1/2";
  const titleStyle = "text-2xl font-bold text-gray-800 mb-2";
  const textStyle = "text-gray-600 font-montserrat";
  const stepItemStyle =
    "flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-lg shadow-md";

  return (
    <div className={containerStyle}>
      <h1 className={headerStyle}>
        The Largest Collection of Residential Real Estate Projects
      </h1>
      <p className={subheaderStyle}>
        List Your Residential Apartments for Sale in Minutes, Completely Free.
      </p>
      <div className={stepContainerStyle}>
        <div className={stepItemStyle}>
          <div className={stepStyle}>1</div>
          <h3 className="text-xl font-semibold">Step 1: Fill Out the Form</h3>
          <p className={textStyle}>
            Complete the form to receive a login account after verification.
          </p>
        </div>
        <div className={stepItemStyle}>
          <div className={stepStyle}>2</div>
          <h3 className="font-montserrat text-xl font-semibold">
            Step 2: List Your Apartments for Sale
          </h3>
          <p className={textStyle}>
            Provide the public details of your real estate project and list the apartments for sale.
          </p>
        </div>
        <div className={stepItemStyle}>
          <div className={stepStyle}>3</div>
          <h3 className="text-xl font-semibold">Step 3: Publish Your Project</h3>
          <p className={textStyle}>
            Once the information is provided, publish it with a single click. You can modify the information at any time.
          </p>
        </div>
      </div>
      <Form />
    </div>
  );
}
