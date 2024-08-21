"use client";
import { useState } from "react";

export default function Form() {
  // Define state to manage form data, errors, selected country, and agreement checkbox
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    country: "", // Add country field
    agreeToTerms: false, // Add checkbox field for agreement
  });
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      agreeToTerms: e.target.checked,
    });
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setFormData({
      ...formData,
      country: country,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation for enterprise email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid enterprise email.");
      return;
    }

    if (!formData.country) {
      setError("Please select a country.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    // Clear error if the form is valid
    setError("");

    // Submit form logic (e.g., API request)
    console.log("Form submitted", formData);
  };

  return (
    <div className="mt-8 w-[800px] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-2xl mb-4 text-center text-gray-800">
        Add Your Property Project for Free
      </h1>
      <p className="text-center mb-6 text-gray-600">
        Provide details about your property to help us tailor the management experience to you.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && <p className="text-red-600 text-center">{error}</p>}
        
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Only professional email. e.g., jane.doe@company.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Property Project Name</label>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your property project name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Select Country</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`p-3 w-full rounded-md ${formData.country === "France" ? "bgcolorS txcolorP border borderI" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
              onClick={() => handleCountrySelect("France")}
            >
              France
            </button>
            <button
              type="button"
              className={`p-3 w-full rounded-md ${formData.country === "Poland" ? "bgcolorS txcolorP border borderI" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
              onClick={() => handleCountrySelect("Poland")}
            >
              Poland
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleCheckboxChange}
            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-gray-700">
            By clicking Add Your Property, I agree that I will provide accurate and non-discriminatory information and comply with the <a href="#" className="text-blue-500 underline">Terms and Conditions</a> and the <a href="#" className="text-blue-500 underline">Add a Property Terms of Service</a>.
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
        >
          Request to Add Your Property
        </button>
      </form>
    </div>
  );
}
