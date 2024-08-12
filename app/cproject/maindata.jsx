import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AvatarComponent from "@/app/cproject/image";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5"; // Correct import for IoEye and IoMdEyeOff

export default function Maindata({
  compagny,
  name,
  country,
  city,
  lat,
  lng,
  cur,
  online,

  user,
}) {
  const supabase = createClient();
  const [projects, setProjects] = useState([]);
  const [editableCompagny, setEditableCompagny] = useState(compagny);
  const [editableName, setEditableName] = useState(name);
  const [editableCountry, setEditableCountry] = useState(country);
  const [editableCity, setEditableCity] = useState(city);
  const [editableLat, setEditableLat] = useState(lat);
  const [editableLng, setEditableLng] = useState(lng);
  const [editableCurrency, setEditableCurrency] = useState(cur); // Currency state
  const [isOnline, setIsOnline] = useState(online); // Online status state
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("project")
      .select(`*`)
      .eq("ide", user.id);

    if (error) {
      console.error("Erreur lors de la récupération des projets :", error);
    } else {
      setProjects(data);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    if (
      !editableCompagny ||
      !editableName ||
      !editableCountry ||
      !editableCity ||
      !editableLat ||
      !editableLng
    ) {
      alert("Tous les champs sont requis.");
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
        online: isOnline,
      })
      .eq("ide", user.id);

    if (error) {
      console.error("Erreur lors de la sauvegarde des données :", error);
      alert("Échec de la sauvegarde des données.");
    } else {
      alert("Données sauvegardées avec succès.");
    }

    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md flex flex-col justify-center items-center mb-8">
      <div className="mb-8">
        <AvatarComponent user={user} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Edit Project Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Company</label>
          <input
            type="text"
            value={editableCompagny}
            onChange={(e) => setEditableCompagny(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Project Name</label>
          <input
            type="text"
            value={editableName}
            onChange={(e) => setEditableName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Country</label>
          <select
            value={editableCountry}
            onChange={(e) => setEditableCountry(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="France">France</option>
            <option value="Poland">Poland</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">City</label>
          <input
            type="text"
            value={editableCity}
            onChange={(e) => setEditableCity(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Latitude</label>
          <input
            type="text"
            value={editableLat}
            onChange={(e) => setEditableLat(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Longitude</label>
          <input
            type="text"
            value={editableLng}
            onChange={(e) => setEditableLng(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Currency</label>
          <select
            value={editableCurrency}
            onChange={(e) => setEditableCurrency(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EUR">Euro (EUR)</option>
            <option value="PLN">Polish Zloty (PLN)</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1 flex">
            Your project is 
            <span className=" text-gray-600 flex items-center">
            <span className="ml-2">{isOnline ? "Online" : "Offline"}</span>
              {isOnline ? (
                <IoEye className="ml-2 text-xl text-green-600" />
              ) : (
                <IoMdEyeOff className="ml-2 text-xl text-red-600" />
              )}
              
            </span>
          </label>
          <div className="relative flex items-center">
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
            >
              <div
                className={`w-10 h-6 flex items-center rounded-full p-1 ${
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
      <button
        onClick={handleSave}
        className={`mt-6 w-full py-2 px-4 rounded-md text-white font-semibold ${
          isSaving ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
        }`}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
