"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import customMarkerIcon from '@/components/b.png'; // Adjust the path as necessary

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

const MapComponent = () => {
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    // Only run the Leaflet configuration on the client side
    if (typeof window !== "undefined") {
      const newIcon = new L.Icon({
        iconUrl: customMarkerIcon.src || customMarkerIcon,
        iconRetinaUrl: customMarkerIcon.src || customMarkerIcon,
        iconSize: [41, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41],
      });
      setIcon(newIcon);
    }
  }, []);

  return (
    <MapContainer
      center={[37.7577, -122.4376]}
      zoom={8}
      style={{ width: "50vw", height: "50vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {icon && (
        <Marker position={[37.7577, -122.4376]} icon={icon}>
          <Popup>User Post Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
