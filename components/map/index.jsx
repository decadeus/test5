"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";


import Avatar from "@/app/getimage/Ugetone";
import Link from "next/link";

// Dynamic import of react-leaflet components
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export function MapComponent({ todos }) {
  const position = [51.505, -0.09];

  return (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "600px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {todos
        .filter((todo) => todo.lat && todo.lng) // Ensure lat and lng are defined
        .map((todo) => (
          <Marker
            key={todo.id}
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
                <Link href={`/${todo.id}`}>
                  <p className="font-bold">See</p>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
