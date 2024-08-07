"use client";
import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import of react-leaflet components

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((module) => module.Marker),
  {
    ssr: false,
  }
);
const Popup = dynamic(
  () => import("react-leaflet").then((module) => module.Popup),
  {
    ssr: false,
  }
);

const MapComponent = ({ lata, lnga, classN }) => {
  return (
    <MapContainer center={[lata, lnga]} zoom={12} className={classN}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lata, lnga]} style={{ color: "lightblue" }}>
        <Popup>User Post Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
