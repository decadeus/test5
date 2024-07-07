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
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="36.767" height="48.001"><g fill="#1a171b"><path d="M23.143 37.881c4.178-6.076 9.957-15.809 9.957-23.164a14.718 14.718 0 0 0-29.435 0c0 7.357 5.783 17.094 9.961 23.168C6.3 38.391 0 40.074 0 42.858 0 46.235 9.248 48 18.383 48s18.384-1.766 18.384-5.143c0-2.782-6.293-4.47-13.624-4.976zM5.121 14.717a13.264 13.264 0 0 1 26.527 0c0 9.492-10.665 23.852-13.264 27.209-2.598-3.357-13.263-17.713-13.263-27.209zm13.262 31.829c-10.334 0-16.929-2.184-16.929-3.688 0-1.309 5.03-3.123 13.155-3.57a91.912 91.912 0 0 0 3.209 4.273.729.729 0 0 0 1.129 0 93.58 93.58 0 0 0 3.213-4.277c8.125.447 13.151 2.266 13.151 3.574.002 1.504-6.593 3.688-16.928 3.688z"/><path d="M26.383 14.848a8 8 0 1 0-8 8 8.009 8.009 0 0 0 8-8zm-14.545 0a6.546 6.546 0 1 1 6.545 6.545 6.555 6.555 0 0 1-6.545-6.545z"/></g></svg>`
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
