"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Avatar from "@/app/getimage/Ugetone";
import Link from "next/link";
import Leaflet from "leaflet";
import imageI from "@/components/b.png";


// Dynamic import of react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((module) => module.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((module) => module.Popup),
  { ssr: false }
);
const markerIcon = new L.Icon({
  iconUrl: {imageI}, // Path to custom marker icon image
  iconSize: [36, 48], // Size of the icon
  iconAnchor: [18, 48], // Anchor point of the icon which should correspond to marker's location
  popupAnchor: [0, -48], // Anchor point for the popup bubble
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

const MapComponent = ({ classN, todos }) => {
  const [center, setCenter] = useState([52.07957, 20.97848]); // Default center

  useEffect(() => {
    if (todos.length > 0) {
      const bounds = getMapBounds(todos);
      setCenter(bounds.getCenter());
    }
  }, [todos]);
  return (
    <MapContainer center={[52.07957, 20.97848]} zoom={12} className={classN}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {todos.map((todo) => (
        <Marker
          key={todo.id}
          position={[todo.lat, todo.lng]}
          style={{ color: "lightblue" }}
          icon={markerIcon}
        >
          <Popup maxWidth={500}>
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
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
