import React, { useState, useEffect } from "react";

function CountrySelector({ onCountryChange }) {
  const [selectedCountry, setSelectedCountry] = useState("France");

  useEffect(() => {
    onCountryChange(selectedCountry);
  }, [selectedCountry, onCountryChange]);

  return (
    <div className="flex gap-4 my-4">
      <button
        className={`px-4 py-2 rounded ${selectedCountry === "France" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => setSelectedCountry("France")}
      >
        France
      </button>
      <button
        className={`px-4 py-2 rounded ${selectedCountry === "Poland" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => setSelectedCountry("Poland")}
      >
        Poland
      </button>
    </div>
  );
}

export default CountrySelector;
