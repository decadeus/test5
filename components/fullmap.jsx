"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/Ugetone";
import Link from "next/link"; // Ensure supabase-js is installed and imported

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
    <MapContainer center={[52.07957, 20.97848]} zoom={12} className={classN}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {todos.map((todo) => (
        <Marker
          key={todo}
          position={[todo.lat, todo.lng]}
          style={{ color: "lightblue" }}
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
              <Link href={`/${todo.id}`}><p className="font-bold">See</p></Link>
            </div>
          </Popup>{" "}
          {/* Assuming todo has a 'name' property */}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
