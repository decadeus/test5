import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AvatarComponent from "../cproject/image";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { companies } from "@/utils/companies";
import { countryData } from "@/utils/countryData";
import { useTranslations } from "next-intl";

export default function Maindata({
  compagny,
  name,
  country,
  link,
  city,
  lat,
  lng,
  cur,
  online,
  swim,
  closed,
  cctv,
  fenced,
  entrance,
  bike,
  disabled,
  child,
  fitness,
  user,
}) {
  const supabase = createClient();
  const [editableCompagny, setEditableCompagny] = useState(compagny);
  const [editableName, setEditableName] = useState(name);
  const [editableCountry, setEditableCountry] = useState(country);
  const [editableCity, setEditableCity] = useState(city);
  const [editableLat, setEditableLat] = useState(lat);
  const [editableLng, setEditableLng] = useState(lng);
  const [editableLink, setEditableLink] = useState(link);
  const [editableCurrency, setEditableCurrency] = useState(cur);
  const [isOnline, setIsOnline] = useState(online);
  const [features, setFeatures] = useState({
    swim,

    cctv,

    entrance,
    bike,
    disabled,
    child,
    fitness,
  });
  const [isSaving, setIsSaving] = useState(false);
  const f = useTranslations("Projet");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("project")
      .select(`*`)
      .eq("ide", user.id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération des projets :", error);
    } else {
      const project = data;
      setEditableCompagny(project.compagny);
      setEditableName(project.name);
      setEditableCountry(project.country);
      setEditableCity(project.city);
      setEditableLat(project.lat);
      setEditableLng(project.lng);
      setEditableCurrency(project.currency);
      setEditableLink(project.link);
      setIsOnline(project.online);
      setFeatures({
        swim: project.swim,

        cctv: project.cctv,
  
        entrance: project.entrance,
        bike: project.bike,
        disabled: project.disabled,
        child: project.child,
        fitness: project.fitness,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    if (
      !editableCompagny ||
      !editableName ||
      !editableCountry ||
      !editableCity || // Ensure city is selected
      !editableLat ||
      !editableLng
    ) {
      alert("All fields, including the city, are required.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from("project")
      .update({
        compagny: editableCompagny,
        name: editableName,
        country: editableCountry,
        city: editableCity,
        lat: editableLat,
        lng: editableLng,
        currency: editableCurrency,
        link: editableLink,
        online: isOnline,
        ...features,
      })
      .eq("ide", user.id);

    if (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save data.");
    } else {
      alert("Data successfully saved.");
    }

    setIsSaving(false);
  };

  const toggleFeature = (feature) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [feature]: !prevFeatures[feature],
    }));
  };

  const CountryCitySelector = ({
    editableCountry,
    setEditableCountry,
    editableCity,
    setEditableCity,
  }) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
      if (editableCountry && countryData[editableCountry]) {
        setCities(countryData[editableCountry]);
      } else {
        setCities([]);
      }
    }, [editableCountry]);

    const handleCountryChange = (e) => {
      const selectedCountry = e.target.value;
      setEditableCountry(selectedCountry);

      // Ensure city is cleared when switching countries
      if (countryData[selectedCountry]) {
        setEditableCity(countryData[selectedCountry][0]);
      } else {
        setEditableCity("");
      }
    };

    const handleCityChange = (e) => {
      setEditableCity(e.target.value);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-white w-[900px]">
        <div className="flex flex-col">
          <label className="text-white mb-1">{f("Pays")}</label>
          <select
            value={editableCountry}
            onChange={handleCountryChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="__">__</option>
            {Object.keys(countryData).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col ">
          <label className="text-white mb-1">{f("Ville")}</label>
          <select
            value={editableCity}
            onChange={handleCityChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={!editableCountry}
          >
            <option value="">__</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto mt-10 p-6 bg-[#12171E] rounded-lg shadow-xl flex flex-col justify-center items-center mb-8 text-white">
      <div className="mb-8">
        <AvatarComponent user={user} />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-4">
        {f("Modifier")}
      </h2>
      <div className="flex gap-8">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div className="flex flex-col mb-4">
              <label className="text-white mb-1">{f("Compagnie")}</label>
              <select
                value={editableCompagny}
                onChange={(e) => setEditableCompagny(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="" disabled>
                  {f("SelectCompany")}
                </option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-white mb-1">{f("NomProjet")}</label>
              <input
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
          <div className="">
            <CountryCitySelector
              editableCountry={editableCountry}
              setEditableCountry={setEditableCountry}
              editableCity={editableCity}
              setEditableCity={setEditableCity}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div className="flex flex-col">
              <label className="text-white mb-1">{f("Latitude")}</label>
              <input
                type="text"
                value={editableLat}
                onChange={(e) => setEditableLat(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-white mb-1">{f("Longitude")}</label>
              <input
                type="text"
                value={editableLng}
                onChange={(e) => setEditableLng(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-white mb-1">{f("Monnaie")}</label>
              <select
                value={editableCurrency}
                onChange={(e) => setEditableCurrency(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="" disabled>
                  __
                </option>
               
                <option value="EUR">EUR</option>
                <option value="PLN">PLN</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-white mb-1">{f("Link")}</label>
              <input
                type="text"
                value={editableLink}
                onChange={(e) => setEditableLink(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </div>


          <div className="flex flex-col">
              <div className="flex flex-col pt-4">
                <label className="text-white mb-1 flex">
                  {f("ProjetEnLigne")}
                  <span className="text-white flex items-center ml-2">
                    <span>{isOnline ? "online" : "offline"}</span>{" "}
                    {/* Corrected this line */}
                    {isOnline ? (
                      <IoEye className="ml-2 text-xl text-green-600" />
                    ) : (
                      <IoMdEyeOff className="ml-2 text-xl text-red-600" />
                    )}
                  </span>
                </label>
              </div>

              <div className="relative flex  ">
                <input
                  type="checkbox"
                  id="onlineSwitch"
                  checked={isOnline}
                  onChange={() => setIsOnline(!isOnline)}
                  className="hidden"
                />
                <label
                  htmlFor="onlineSwitch"
                  className="flex items-center cursor-pointer"
                  aria-label="Toggle project online status"
                >
                  <div
                    className={`w-10 h-6 flex  items-center rounded-full p-1 ${
                      isOnline ? "bg-green-500" : "bg-red-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                        isOnline ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>




        </div>
        <div className="flex flex-col justify-center">
        <div className="grid grid-cols-1 gap-4">
  {Object.keys(features).map((feature) => (
    <div className="relative flex items-center pr-12" key={feature}>
      <input
        type="checkbox"
        id={`${feature}Switch`}
        checked={features[feature]}
        onChange={() => toggleFeature(feature)}
        className="hidden"
      />
      <label
        htmlFor={`${feature}Switch`}
        className="flex items-center cursor-pointer w-full"
        aria-label={`Toggle ${feature} feature`}
      >
        <div
          className={`w-10 h-6 flex-shrink-0 flex items-center rounded-full p-1 ${
            features[feature] ? "bg-blue-500" : "bg-gray-600"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
              features[feature] ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </div>
        <p className="ml-2 capitalize truncate">{f(feature)}</p>
      </label>
    </div>
  ))}
</div>

        </div>
      </div>
      <button
        onClick={handleSave}
        className={`mt-8 bg-blue-500 text-white px-6 py-2 rounded-md ${
          isSaving ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSaving}
      >
        {isSaving ? f("Saving...") : f("Sauvegarder")}
      </button>
    </div>
  );
}
