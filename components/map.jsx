"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';

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
  useEffect(() => {
    // Only run the Leaflet configuration on the client side
    if (typeof window !== "undefined") {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: MarkerIcon,
        iconUrl: MarkerIcon,
        shadowUrl: MarkerShadow,
      });
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
      <Marker position={[37.7577, -122.4376]}>
        <Popup>San Francisco</Popup>
      </Marker>
      <Marker position={[37.7749, -122.4194]}>
        <Popup>Another Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
