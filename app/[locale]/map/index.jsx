import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Avatar from "@/app/getimage/project";
import Link from "next/link";
import a from "@/components/image/appart1.jpg";
import { FaMapMarkerAlt } from "react-icons/fa";
import Point from "@/components/svg/point";

const createTextIcon = () => {
  const flowerSVG = ReactDOMServer.renderToStaticMarkup(<Point />);
  return new L.DivIcon({
    html: `<div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">${flowerSVG}</div>`,
    iconSize: [48, 48],
    className: "custom-icon",
  });
};

const getMapBounds = (todos) => {
  const bounds = new L.LatLngBounds([]);
  todos.forEach((todo) => {
    const latLng = new L.LatLng(todo.lat, todo.lng);
    bounds.extend(latLng);
  });
  return bounds;
};

const AutoZoom = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds);
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

  const bounds = getMapBounds(todos);
  if (bounds.isValid()) {
    bounds.pad(0.05);
  }

  return (
    <>
   <style>{`
  .leaflet-popup-content {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  
  .leaflet-popup-content-wrapper {
    padding: 0 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }

  .leaflet-popup-tip {
    display: none !important;
  }

  .popup-container img {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: auto !important;
    display: block !important;
  }
`}</style>

    <MapContainer center={center} zoom={4} className={classN} minZoom={4}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <AutoZoom bounds={bounds} />
      {todos
        .filter((todo) => todo.lat && todo.lng)
        .map((todo) => (
          <Marker
            key={todo.id}
            position={[todo.lat, todo.lng]}
            icon={createTextIcon()}
          >
            <Popup>
              <div className="bg-white shadow-xl overflow-hidden w-[300px] rounded-lg border-b-blue-700 border-b-5">
                <h2 className="font-bold text-xl text-gray-900 pl-2">{todo.name}</h2>
                <div className="relative h-48 w-full">
                  <Avatar
                    url={todo.mainpic_url || a}
                    width={500}
                    height={200}
                    className="object-cover w-full h-full"
                    alt="Project Image"
                  />
                </div>
                <div className="text-gray-700 text-sm">
                  <span className="text-base font-medium text-gray-800 pl-2">
                    By {todo.compagny}
                  </span>
                </div>

                <div className="w-full flex items-center justify-center my-2">
  <div className="w-full flex justify-center items-center text-sm mb-2">
    {todo.qty} Appartment(s)
  </div>
  <div className="w-full flex justify-center">
    <Link href={`/en/detailproject/${todo.codepro}`}>
      <button className="w-full  py-1 px-6 flex items-center justify-center text-white text-base font-semibold bg-gradient-to-r from-yellow-800 to-yellow-700 rounded-md shadow-xl">
        Details
      </button>
    </Link>
  </div>
</div>


              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
    </>
  );
};

export default MapComponent;
