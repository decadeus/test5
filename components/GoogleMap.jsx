"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import { useParams } from 'next/navigation';

// Préparation migration Advanced Marker
const libraries = ['places', 'marker']; // <-- à garder en dehors du composant

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
};

const GoogleMapComponent = ({ apartments, projectImages, currentImageIndexes, locale, inactiveMarker, onMarkerClick }) => {
  const t = useTranslations("Filtre");
  const params = useParams();
  const currentLocale = params?.locale || 'fr';
  
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);

  // Reviens à l'appel direct
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
    libraries,
  });

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

  // Ajout des Advanced Markers après chargement de la carte
  useEffect(() => {
    if (!map || !window.google || !window.google.maps || !window.google.maps.marker) return;
    // Nettoyage des anciens markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (!Array.isArray(apartments)) return;
    const valid = apartments.filter(apt =>
      apt.lat && apt.lng &&
      !isNaN(parseFloat(apt.lat)) && !isNaN(parseFloat(apt.lng)) &&
      parseFloat(apt.lat) !== 0 && parseFloat(apt.lng) !== 0
    );
    valid.forEach((apt) => {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: parseFloat(apt.lat), lng: parseFloat(apt.lng) },
        title: apt.title || '',
        // icon: tu peux personnaliser ici si besoin
      });
      // Ajout du gestionnaire de clic pour ouvrir la fiche projet à droite
      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(apt));
      }
      markersRef.current.push(marker);
    });
    // Pas d'InfoWindow pour l'instant (fiche projet à droite)
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, apartments, onMarkerClick]);

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
          mapId: 'DEMO_MAP_ID', // <-- à remplacer par ton vrai mapId si tu en as un
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {/* Markers avancés gérés via useEffect */}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent; 