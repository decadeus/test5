"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Avatar from "@/app/getimage/Ugetone";
import Link from "next/link";
import {Icon} from "leaflet";



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
  const markerIcon =new Icon({
    iconUrl: 'https://img.icons8.com/plasticine/100/exterior.png',
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

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
            <div className="flex-row w-full">
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
