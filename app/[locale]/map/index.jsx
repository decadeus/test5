import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Avatar from "@/app/getimage/project";
import Link from "next/link";
import a from "@/components/image/appart1.jpg";

// Fonction pour créer une icône texte personnalisée
const createTextIcon = (text) => {
  return new L.DivIcon({
    html: `
      <div class="custom-bubble">
        <div class="bubble-content">${text}</div>
        <div class="bubble-pointer"></div>
      </div>
    `,
    iconSize: null, // Laisser iconSize null pour que la taille s'adapte automatiquement
    className: "custom-text-icon", // Classe CSS pour personnaliser le style
  });
};

// Fonction pour ajuster automatiquement les limites de la carte
const getMapBounds = (todos) => {
  const bounds = new L.LatLngBounds([]);
  todos.forEach((todo) => {
    const latLng = new L.LatLng(todo.lat, todo.lng);
    bounds.extend(latLng);
  });
  return bounds;
};

// Composant pour appliquer un zoom automatique
const AutoZoom = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50], // Ajoute un peu de marge autour des marqueurs
      });
    }
  }, [map, bounds]);
  return null;
};

const MapComponent = ({ classN, todos, maxLat, minLng, mLat, mLng }) => {
  const [center, setCenter] = useState([
    mLat || 52.22767841358763,
    mLng || 2.341876947781295,
  ]);

  useEffect(() => {
    if (todos.length > 0) {
      const bounds = getMapBounds(todos);
      setCenter(bounds.getCenter());
    }
  }, [todos]);

  // Calcul des bornes avec un ajustement de ±5 pour la longitude
  const bounds = getMapBounds(todos);
  if (bounds.isValid()) {
    bounds.pad(0.05); // Ajuster le zoom en ajoutant un padding global de 5%
  }

  return (
    <MapContainer
      center={center}
      zoom={4}
      className={classN}
      minZoom={4}  // Zoom minimum autorisé
    
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Application du zoom automatique */}
      <AutoZoom bounds={bounds} />

      {todos
        .filter((todo) => todo.lat && todo.lng) // Vérification si lat et lng sont définis
        .map((todo) => (
          <Marker
            key={todo.id}
            position={[todo.lat, todo.lng]}
            icon={createTextIcon(todo.name)} // Utilisation d'un texte comme icône
          >
            <Popup  className="w-[300px] bg-red-300">
              <div className="bg-white shadow-sm overflow-hidden w-full transition-transform duration-300 hover:scale-105 rounded-lg">
                <div className="relative h-44 w-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-lg">
                  <Avatar
                    url={todo.mainpic_url || a}
                    width={350}
                    height={150}
                    className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-300 rounded-t-lg"
                    alt="Project Image"
                  />
                </div>
                <div className="">
                  <h2 className="font-bold text-xl text-gray-900 ">
                    {todo.name}
                  </h2>
                  <div className="text-gray-700 text-sm">
                    <span className="text-base font-medium text-gray-800 ">
                      By {todo.compagny}
                    </span>
                    <div className="flex gap-1 mt-2 ">
                    <span className="">
                        {todo.city}
                      </span>
                      <span className="font-bold">
                        {todo.country}
                      </span>
                    
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                  <Link href={`/detailproject/${todo.codepro}`}>
                      <button className="w-full py-2 px-4 flex items-center justify-center text-white bg-gradient-to-r from-yellow-800 to-yellow-700 rounded-full  shadow-lg transform hover:scale-105">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        View Project
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default MapComponent;
