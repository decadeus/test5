"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Avatar from "@/app/getimage/Ugetone";
import Link from "next/link";
import L from "leaflet";
import B from "@/components/icon8.png";

// Dynamic import of react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  { ssr: false }
);
const MarkerClusterGroup = dynamic(
  () => import("react-leaflet").then((module) => module.MarkerClusterGroup),
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

// Helper function to get map bounds based on todos
const getMapBounds = (todos) => {
  const bounds = new L.LatLngBounds();
  todos.forEach((todo) => {
    bounds.extend([todo.lat, todo.lng]);
  });
  return bounds;
};

// Custom icon for map markers
const customIcon = new L.Icon({
  iconUrl: B.src,
  iconSize: [38, 38],
});

const MapComponent = ({ classN, todos }) => {
  const [center, setCenter] = useState([52.07957, 20.97848]); // Default center

  useEffect(() => {
    if (todos.length > 0) {
      const bounds = getMapBounds(todos);
      setCenter(bounds.getCenter());
    }
  }, [todos]);

  return (
    <MapContainer center={center} zoom={12} className={classN}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {todos.map((todo) => (
        <Marker key={todo.id} position={[todo.lat, todo.lng]} icon={customIcon}>
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
