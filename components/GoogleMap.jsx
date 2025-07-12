"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import { useParams } from 'next/navigation';

// Préparation migration Advanced Marker
const libraries = ['places', 'marker']; // <-- à garder en dehors du composant

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
};

const defaultFranceCenter = { lat: 46.603354, lng: 1.888334 };
const defaultFranceZoom = 5;
const singleProjectZoom = 13;

// Wrapper pour forcer un reset à chaque rechargement
const GoogleMapResetWrapper = (props) => {
  // Utilise un timestamp pour forcer le reset à chaque montage
  const [mapKey] = useState(() => Date.now().toString());
  return <GoogleMapComponent {...props} mapKey={mapKey} />;
};

const GoogleMapComponent = ({ apartments, projectImages, currentImageIndexes, locale, inactiveMarker, onMarkerClick, mapKey }) => {
  const t = useTranslations("Filtre");
  const params = useParams();
  const currentLocale = params?.locale || 'fr';
  
  // Calculer le centre et le zoom dynamiquement (doit être avant les hooks qui l'utilisent)
  const validApartments = useMemo(() => Array.isArray(apartments)
    ? apartments.filter(apt =>
        apt.lat && apt.lng &&
        !isNaN(parseFloat(apt.lat)) && !isNaN(parseFloat(apt.lng)) &&
        parseFloat(apt.lat) !== 0 && parseFloat(apt.lng) !== 0
      )
    : [], [apartments]);

  const [map, setMap] = useState(null);
  const markersRef = useRef([]);
  const [hasUserMovedMap, setHasUserMovedMap] = useState(false);
  const lastApartmentsHash = useRef(apartments.map(a => a.id).join(','));
  const [shouldUpdateCenter, setShouldUpdateCenter] = useState(true);
  const [lastCenter, setLastCenter] = useState(null);
  const [hasMapBeenInitialized, setHasMapBeenInitialized] = useState(false);

  // Reviens à l'appel direct
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
    libraries,
  });

  const onLoad = useCallback((map) => {
    setMap(map);
    setHasMapBeenInitialized(true);
    // Toujours réinitialiser le zoom/center au chargement
    if (validApartments.length === 0) {
      map.setCenter(defaultFranceCenter);
      map.setZoom(defaultFranceZoom);
    } else if (validApartments.length === 1) {
      map.setCenter({ lat: parseFloat(validApartments[0].lat), lng: parseFloat(validApartments[0].lng) });
      map.setZoom(singleProjectZoom);
    } else {
      // Plusieurs projets : fitBounds
      const bounds = new window.google.maps.LatLngBounds();
      validApartments.forEach(apt => bounds.extend({ lat: parseFloat(apt.lat), lng: parseFloat(apt.lng) }));
      map.fitBounds(bounds);
    }
  }, [validApartments]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const mapCenter = useMemo(() => {
    if (validApartments.length === 0) return defaultFranceCenter;
    if (validApartments.length === 1) return { lat: parseFloat(validApartments[0].lat), lng: parseFloat(validApartments[0].lng) };
    const totalLat = validApartments.reduce((sum, apt) => sum + parseFloat(apt.lat), 0);
    const totalLng = validApartments.reduce((sum, apt) => sum + parseFloat(apt.lng), 0);
    return {
      lat: totalLat / validApartments.length,
      lng: totalLng / validApartments.length
    };
  }, [validApartments]);

  const dynamicZoom = useMemo(() => {
    if (validApartments.length === 0) return defaultFranceZoom;
    if (validApartments.length === 1) return singleProjectZoom;
    return 10; // valeur par défaut, sera ajustée par fitBounds
  }, [validApartments]);

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
    const currentHash = apartments.map(a => a.id).join(',');
    console.log('[GoogleMap] fitBounds effect', { hasUserMovedMap, apartmentsHash: currentHash });
    // Ne fait le fitBounds que si la liste d'appartements (ids) a vraiment changé
    if (!map || !Array.isArray(apartments) || hasUserMovedMap) return;
    if (lastApartmentsHash.current === currentHash) return;
    lastApartmentsHash.current = currentHash;
    // Ne rien faire ici, tout est géré dans onLoad
  }, [map, apartments, hasUserMovedMap, validApartments]);

  // Réinitialise hasUserMovedMap à false quand apartments change (nouvelle recherche, filtre, etc.)
  useEffect(() => {
    setHasUserMovedMap(false);
    lastApartmentsHash.current = apartments.map(a => a.id).join(',');
  }, [apartments]);

  // Détecte un vrai changement de la liste d'appartements (hash des ids)
  useEffect(() => {
    const currentHash = apartments.map(a => a.id).join(',');
    if (lastApartmentsHash.current !== currentHash) {
      setShouldUpdateCenter(true);
      lastApartmentsHash.current = currentHash;
    }
  }, [apartments]);

  // Mémorise le dernier center utilisé
  useEffect(() => {
    if (shouldUpdateCenter) {
      setLastCenter(mapCenter);
      setShouldUpdateCenter(false);
    }
  }, [shouldUpdateCenter, mapCenter]);

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

  // Clé unique pour forcer la réinitialisation de la map à chaque changement de la liste
  // const mapKey = useMemo(() => apartments.map(a => a.id).join(','), [apartments]);

  // Déclarer le style du conteneur AVANT tout return ou condition
  const [containerStyle, setContainerStyle] = useState({ width: '100%', height: '220px' });

  useEffect(() => {
    // Cette partie ne s'exécutera que côté client
    const getResponsiveContainerStyle = () => {
      let height = 220;
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) height = 500;
        else if (window.innerWidth >= 640) height = 350;
      }
      return { width: '100%', height: `${height}px` };
    };
    setContainerStyle(getResponsiveContainerStyle());
    const handleResize = () => {
      setContainerStyle(getResponsiveContainerStyle());
      // Forcer le resize de la map Google si elle existe
      if (window.google && window.google.maps && map) {
        window.google.maps.event.trigger(map, 'resize');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  if (!isLoaded) {
    return (
      <div style={{ width: '100%', height: 220 }} className="w-full bg-gray-200 flex items-center justify-center">
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
        key={mapKey}
        mapContainerStyle={containerStyle}
        center={shouldUpdateCenter || !lastCenter ? mapCenter : lastCenter}
        zoom={dynamicZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDrag={() => setHasUserMovedMap(true)}
        onZoomChanged={() => setHasUserMovedMap(true)}
        options={{
          mapId: 'DEMO_MAP_ID',
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

export default GoogleMapResetWrapper; 