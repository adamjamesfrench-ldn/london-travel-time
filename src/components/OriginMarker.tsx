'use client';

import { Marker } from 'react-map-gl/mapbox';

interface OriginMarkerProps {
  latitude: number;
  longitude: number;
}

export default function OriginMarker({ latitude, longitude }: OriginMarkerProps) {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor="center">
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring */}
        <div className="absolute w-8 h-8 rounded-full bg-[#00d4ff]/20 animate-ping" />
        {/* Outer ring */}
        <div className="absolute w-5 h-5 rounded-full bg-[#00d4ff]/30" />
        {/* Inner dot */}
        <div className="w-3 h-3 rounded-full bg-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.6)]" />
      </div>
    </Marker>
  );
}
