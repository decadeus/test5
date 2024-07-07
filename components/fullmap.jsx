"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';
import { createClient } from "@/utils/supabase/client"; // Ensure supabase-js is installed and imported

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

const MapComponent = ({ lata, lnga, classN }) => {
  // Initialize Supabase client

  const supabase = createClient();

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: residences, error: residenceError } = await supabase
        .from("residence")
        .select("*");

      if (residenceError) {
        console.log("error", residenceError);
      } else {
        setTodos(residences);
      }
    }

    fetchData();
  }, []);

  return (
    <MapContainer
      center={[52.07957, 20.97848]}
      zoom={12}
      className={classN}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {todos.map((todo) => (
        <Marker key={todo} position={[todo.lat, todo.lng]} style={{ color: "lightblue" }}>
          <Popup>{todo.city}</Popup> {/* Assuming todo has a 'name' property */}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
