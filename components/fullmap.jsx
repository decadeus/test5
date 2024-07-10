"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Avatar from "@/app/getimage/Ugetone";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Leaflet from "leaflet";

// Import Leaflet library

import imageI from "@/components/Icon2.png";

// Dynamic import of react-leaflet components
const MapContainerDynamic = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  { ssr: false }
);
const TileLayerDynamic = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  { ssr: false }
);
const MarkerDynamic = dynamic(
  () => import("react-leaflet").then((module) => module.Marker),
  { ssr: false }
);
const PopupDynamic = dynamic(
  () => import("react-leaflet").then((module) => module.Popup),
  { ssr: false }
);

const MapComponent = ({ classN, todos }) => {
  const [center, setCenter] = useState([52.07957, 20.97848]); // Default center

  useEffect(() => {
    if (todos.length > 0) {
      const bounds = getMapBounds(todos);
      setCenter(bounds.getCenter());
    }
  }, [todos]);

  // Define markerIcon using Leaflet
  const markerIcon = Leaflet.divIcon({
    html:`<svg height="32px" width="32px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 293.334 293.334" xml:space="preserve" fill="#ff0000" stroke="#ff0000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path style="fill:#c51111;" d="M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878 c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212 c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084 c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358 c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307 C198.98,120.938,175.559,144.358,146.667,144.358z"></path> <circle style="fill:#c51111;" cx="146.667" cy="90.196" r="21.756"></circle> </g> </g> </g></svg>`
  });

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

  return (
    <MapContainerDynamic center={center} zoom={12} className={classN}>
      <TileLayerDynamic
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {todos.map((todo) => (
        <MarkerDynamic
          key={todo.id}
          position={[todo.lat, todo.lng]}
          icon={markerIcon} // Assign custom marker icon here
        >
          <PopupDynamic maxWidth={500}>
            <div className="flex flex-col w-full pt-4">
              <div className="w-[150px] aspect-square rounded-md">
                <Avatar
                  url={todo.mainpic_url}
                  width={350}
                  height={350}
                  className="w-[350px] h-[350px] rounded-md"
                  style={{
                    objectFit: "cover",
                    width: "350px",
                    height: "350px",
                  }}
                />
              </div>
              <div className="pt-2">{todo.city}</div>
              <Link href={`/${todo.id}`}>
                <p className="font-bold">See</p>
              </Link>
            </div>
          </PopupDynamic>
        </MarkerDynamic>
      ))}
    </MapContainerDynamic>
  );
};

export default MapComponent;
