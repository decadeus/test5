"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import { useParams } from 'next/navigation';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
};

const GoogleMapComponent = ({ apartments, projectImages, currentImageIndexes, locale }) => {
  const t = useTranslations("Filtre");
  const params = useParams();
  const currentLocale = params?.locale || 'fr';
  
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
  });

  // Vérifier si la clé API est configurée
  const isApiKeyConfigured = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && 
                            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE';

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculer le centre de la carte basé sur les appartements
  const mapCenter = useMemo(() => {
    if (!Array.isArray(apartments) || apartments.length === 0) return defaultCenter;
    
    const validApartments = apartments.filter(apt => 
      apt.lat && apt.lng && 
      !isNaN(parseFloat(apt.lat)) && !isNaN(parseFloat(apt.lng)) &&
      parseFloat(apt.lat) !== 0 && parseFloat(apt.lng) !== 0
    );
    
    if (validApartments.length === 0) return defaultCenter;
    
    const totalLat = validApartments.reduce((sum, apt) => sum + parseFloat(apt.lat), 0);
    const totalLng = validApartments.reduce((sum, apt) => sum + parseFloat(apt.lng), 0);
    
    return {
      lat: totalLat / validApartments.length,
      lng: totalLng / validApartments.length
    };
  }, [apartments]);

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    if (typeof price === "number") return price.toLocaleString("fr-FR") + " €";
    const num = Number(price);
    if (isNaN(num)) return price;
    return num.toLocaleString("fr-FR") + " €";
  };

  // Fonction pour obtenir le prix minimum d'un projet
  const getMinPrice = (projectlist) => {
    if (!projectlist || projectlist.length === 0) return null;
    const prices = projectlist.map(lot => parseFloat(lot.price)).filter(price => !isNaN(price));
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  // Fit bounds automatique pour englober tous les repères
  useEffect(() => {
    if (!map || !Array.isArray(apartments)) return;
    const valid = apartments.filter(apt =>
      apt.lat && apt.lng &&
      !isNaN(parseFloat(apt.lat)) && !isNaN(parseFloat(apt.lng)) &&
      parseFloat(apt.lat) !== 0 && parseFloat(apt.lng) !== 0
    );
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setCenter({ lat: parseFloat(valid[0].lat), lng: parseFloat(valid[0].lng) });
      map.setZoom(13);
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    valid.forEach(apt => bounds.extend({ lat: parseFloat(apt.lat), lng: parseFloat(apt.lng) }));
    map.fitBounds(bounds);
  }, [map, apartments]);

  if (!isApiKeyConfigured) {
    return (
      <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Clé API Google Maps manquante</h3>
          <p className="text-gray-600 mb-4">
            Pour afficher la carte, vous devez configurer votre clé API Google Maps.
          </p>
          <a 
            href="/GOOGLE_MAPS_SETUP.md" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir les instructions
          </a>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("ChargementCarte")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {(apartments || [])
          .filter(apt => 
            apt.lat && apt.lng && 
            !isNaN(parseFloat(apt.lat)) && !isNaN(parseFloat(apt.lng)) &&
            parseFloat(apt.lat) !== 0 && parseFloat(apt.lng) !== 0
          )
          .map((apt) => (
            <Marker
              key={apt.id}
              position={{ lat: parseFloat(apt.lat), lng: parseFloat(apt.lng) }}
              onClick={() => setSelectedApartment(apt)}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#16a34a" stroke="#ffffff" stroke-width="2"/>
                    <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">🏠</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20)
              }}
            />
          ))}

        {selectedApartment && (
          <InfoWindow
            position={{ lat: parseFloat(selectedApartment.lat), lng: parseFloat(selectedApartment.lng) }}
            onCloseClick={() => setSelectedApartment(null)}
          >
            <div className="max-w-xs p-2">
              <div className="mb-2">
                <img
                  src={(projectImages[selectedApartment.id] && projectImages[selectedApartment.id].length > 0 
                    ? projectImages[selectedApartment.id][currentImageIndexes[selectedApartment.id] || 0] 
                    : "/components/image/placeholder.jpg")}
                  alt={selectedApartment.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {selectedApartment.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  📍 {selectedApartment.city}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  🏢 {selectedApartment.projectlist?.length || 0} {t("appartement")}{(selectedApartment.projectlist?.length || 0) > 1 ? 's' : ''}
                </p>
                {getMinPrice(selectedApartment.projectlist) && (
                  <p className="text-sm font-semibold text-green-600 mb-3">
                    À partir de {formatPrice(getMinPrice(selectedApartment.projectlist))}
                  </p>
                )}
                <Link 
                  href={`/${currentLocale}/DesignTest/Detail/${selectedApartment.id}`}
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  {t("Voir le détail")}
                </Link>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent; 