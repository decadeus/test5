'use client';
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function GoogleMaps({ lata, lnga }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
      });

      const { Map } = await loader.importLibrary("maps");

      const locationInMap = {
        lat: parseFloat(lata),
        lng: parseFloat(lnga),
      };

      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const options = {
        center: locationInMap,
        zoom: 15,
        mapId: "NEXT_MAPS_TUTS",
      };

      const map = new Map(mapRef.current, options);

      // Add the marker in the map
      const marker = new AdvancedMarkerElement({
        map: map,
        position: locationInMap,
      });
    };

    initializeMap();
  }, [lata, lnga]);

  return <div className="h-[600px]" ref={mapRef} />;
}
