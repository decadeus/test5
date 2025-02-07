"use client";
import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Point from "@/components/svg/point";
import ReactDOMServer from "react-dom/server";
import L from "leaflet"; // Import ReactDOMServer


const createTextIcon = () => {
  // Render the Flower component as static HTML
  const flowerSVG = ReactDOMServer.renderToStaticMarkup(<Point />);

  return new L.DivIcon({
    html: `
      <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <!-- Embed the static SVG directly inside the DivIcon -->
        ${flowerSVG}
      </div>`,
    iconSize: [48, 48], // Set the size of the icon
    className: "custom-icon", // Optional: you can add custom styles here
  });
};

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

const MapComponent = ({ position, classN }) => {
  return (
    <MapContainer center={position} zoom={12} className={classN}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={createTextIcon()}>
        
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
