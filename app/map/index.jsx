"use client";

import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Avatar from "@/app/getimage/project";
import Link from "next/link";
import a from "@/components/image/appart1.jpg";

const getMapBounds = (todos) => {
  // Initialize empty bounds
  const bounds = new L.latLngBounds([]);

  // Iterate through todos and extend bounds for each marker
  todos.forEach((todo) => {
    const latLng = new L.latLng(todo.lat, todo.lng);
    bounds.extend(latLng);
  });

  return bounds;
};

const MapComponent = ({ classN, todos }) => {
  const [center, setCenter] = useState([49.07957, 12.97848]); // Default center (Continental United States)

  useEffect(() => {
    if (todos.length > 0) {
      const bounds = getMapBounds(todos);

      // Automatically adjusts zoom to fit bounds
      setCenter(bounds.getCenter());
    }
  }, [todos]);

  return (
    <MapContainer center={center} zoom={4} className={classN}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {todos
        .filter((todo) => todo.lat && todo.lng) // Ensure lat and lng are defined
        .map((todo) => (
          <Marker key={todo.id} position={[todo.lat, todo.lng]}>
          <Popup maxWidth={450} className="p-0 m-0">
            <div className="bg-white  shadow-lg overflow-hidden w-full max-w-sm transition-transform duration-300 hover:scale-105">
              {/* Header with Gradient */}
              <div className="relative h-36 w-full bg-gradient-to-r from-indigo-500 to-blue-500">
                <Avatar
                  url={todo.mainpic_url || a}
                  width={350}
                  height={150}
                  className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-300"  // No rounded classes here
                  alt="Project Image"
                />
              </div>
        
              {/* Content */}
              <div className="px-8">
                {/* Title */}
                <h2 className="font-extrabold text-xl text-gray-900 p-0 m-0">{todo.name}</h2>
                
        
                {/* Company and Location */}
                <div className="text-gray-700 text-sm">
                  <p className="text-base font-semibold text-gray-800 p-0 m-0">By {todo.compagny}</p>
                  <div className="flex gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                      {todo.country}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                      {todo.city}
                    </span>
                  </div>
                </div>
        
                {/* Button */}
                <div className="mt-3 flex justify-center">
                  <Link href={`/project/${todo.id}`}>
                    <button className="w-full py-1.5 px-3 flex items-center justify-center text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-600 hover:to-blue-600 transition duration-300 shadow-md">
                      <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      View Project
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
        
        
        ))}
    </MapContainer>
  );
};

export default MapComponent;
