'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import MapGL, { NavigationControl, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants';
import type { ParsedIsochrone } from '@/lib/geo-utils';
import IsochroneLayer from './IsochroneLayer';
import OriginMarker from './OriginMarker';

interface MapProps {
  origin: { lat: number; lng: number } | null;
  isochrones: ParsedIsochrone[];
  onMapClick?: (lat: number, lng: number) => void;
  flyToTarget?: { lat: number; lng: number } | null;
}

export default function Map({ origin, isochrones, onMapClick, flyToTarget }: MapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const clickTimer = useRef<NodeJS.Timeout>();
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (flyToTarget && mapRef.current) {
      mapRef.current.flyTo({
        center: [flyToTarget.lng, flyToTarget.lat],
        zoom: 12,
        duration: 1500,
      });
    }
  }, [flyToTarget]);

  const handleClick = useCallback(
    (e: { lngLat: { lat: number; lng: number } }) => {
      // Delay to distinguish single click from double-click zoom
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => {
        onMapClick?.(e.lngLat.lat, e.lngLat.lng);
      }, 300);
    },
    [onMapClick]
  );

  const handleDblClick = useCallback(() => {
    // Cancel the pending single-click so it doesn't set a new origin
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }, []);

  return (
    <MapGL
      ref={mapRef}
      initialViewState={{
        latitude: origin?.lat ?? DEFAULT_CENTER.lat,
        longitude: origin?.lng ?? DEFAULT_CENTER.lng,
        zoom: DEFAULT_ZOOM,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      onClick={handleClick}
      onDblClick={handleDblClick}
      onLoad={() => setMapLoaded(true)}
      maxZoom={16}
      minZoom={8}
    >
      {mapLoaded && (
        <>
          <NavigationControl position="bottom-right" showCompass={false} />
          <IsochroneLayer isochrones={isochrones} />
          {origin && <OriginMarker latitude={origin.lat} longitude={origin.lng} />}
        </>
      )}
    </MapGL>
  );
}
