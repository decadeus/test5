"use client";

import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Avatar from "@/app/getimage/Ugetone";
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
    <MapContainer center={center} zoom={5} className={classN}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {todos
        .filter((todo) => todo.lat && todo.lng) // Ensure lat and lng are defined
        .map((todo) => (
          <Marker
            key={todo.id}
            position={[todo.lat, todo.lng]}
            style={{ color: "lightblue" }}
          >
            <Popup maxWidth={900}>
              <div className="flex gap-4 w-full">
                <div className="w-[250px] h-[150px] relative rounded-md">
                  <Avatar
                    url={todo.mainpic_url || a}
                    width={350}
                    height={350}
                    className="w-[350px] h-[350px] rounded-md"
                    style={{
                      objectFit: "cover",
                      width: "250px",
                      height: "150px",
                    }}
                  />
                </div>

                <div className="w-[200px] grid grid-cols-1 grid-rows-4 gap-0">
                  <div>
                    <h2 className="font-bold text-xl">{todo.name}</h2>
                  </div>
                  
                  <div className="row-start-4">
                    <h2>{todo.compagny}</h2>
                  </div>
                  <div className="row-start-2">
                    <h2>{todo.country}</h2>
                  </div>
                  <div className="row-start-3">
                    <h2>{todo.city}</h2>
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
