"use client";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 48.8584,
  lng: 2.2945,
};

export default function TestGoogleMap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return <div>ChargementCarte</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Test Google Map</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      />
    </div>
  );
}
