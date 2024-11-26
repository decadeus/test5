"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { brotliDecompress } from "zlib";

export default function Form() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    country: "France", // Default country set to "France"
    compagny: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      agreeToTerms: e.target.checked,
    });
  };

  const handleCountrySelect = (country) => {
    setFormData({
      ...formData,
      country: country,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supabase = createClient();

    // Validation for required fields
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid enterprise email.");
      return;
    }
    if (!formData.country) {
      setError("Please select a country.");
      return;
    }
    if (!formData.message) {
      setError("Please enter a property project name.");
      return;
    }
    if (!formData.compagny) {
      setError("Please enter a company name.");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setError(""); // Clear previous errors

    // Insert data into Supabase
    try {
      const { data, error } = await supabase
        .from('requestaddproject') // Replace with your Supabase table name
        .insert([{
          email: formData.email,
          message: formData.message,
          country: formData.country,
          compagny: formData.compagny,
          agreeToTerms: formData.agreeToTerms
        }]);

      if (error) throw error;

      setSuccess("Form submitted successfully! You will receive, within less than 24 hours, a link to log in and start filling out and displaying your project.");


      setFormData({
        email: "",
        message: "",
        country: "France", // Reset to default "France"
        compagny: "",
        agreeToTerms: false,
      });
    } catch (error) {
      setError("Error submitting form. Please try again later.");
      console.error("Supabase error:", error.message);
    }
  };

  return (
    <div className="mt-8 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-2xl mb-4 text-center text-gray-800">
        Add Your Property Project for Free
      </h1>
      <p className="text-center mb-6 text-gray-600">
        Provide details about your property to help us tailor the management experience to you.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your property project name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Property Project Company</label>
          <input
            type="text"
            name="compagny"
            value={formData.compagny}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your company name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Select Country</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`p-3 w-full rounded-sm ${formData.country === "France" ? "bg-blue-500 text-white border-blue-700" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
              onClick={() => handleCountrySelect("France")}
            >
              France
            </button>
            <button
              type="button"
              className={`p-3 w-full rounded-sm ${formData.country === "Poland" ? "bg-blue-500 text-white border-blue-700" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
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
            By clicking Add Your Property, I agree to the <a href="#" className="text-blue-500 underline">Terms and Conditions</a>.
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 rounded-sm transition duration-300"
        >
          Request to Add Your Property
        </button>
      </form>
    </div>
  );
}
