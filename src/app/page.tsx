'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ControlPanel from '@/components/ControlPanel';
import { fetchIsochrones } from '@/lib/traveltime';
import type { LocationResult } from '@/components/LocationSearch';
import { parseResults, type ParsedIsochrone } from '@/lib/geo-utils';
import { DEFAULT_MODES, DEFAULT_TRAVEL_TIME_MINUTES, type TransportMode } from '@/lib/constants';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

function getTimeBands(maxMinutes: number): number[] {
  const bands: number[] = [];
  if (maxMinutes >= 10) bands.push(10);
  if (maxMinutes >= 20) bands.push(20);
  if (maxMinutes >= 30) bands.push(Math.min(maxMinutes, 30));
  if (maxMinutes > 30) bands.push(maxMinutes);
  if (bands.length === 0) bands.push(maxMinutes);
  return bands;
}

function buildDepartureISO(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const date = new Date(now);
  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() === 0 || date.getDay() === 6);
  date.setHours(h, m, 0, 0);
  return date.toISOString();
}

export default function Home() {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [travelTime, setTravelTime] = useState(DEFAULT_TRAVEL_TIME_MINUTES);
  const [activeModes, setActiveModes] = useState<TransportMode[]>(DEFAULT_MODES);
  const [departureTime, setDepartureTime] = useState('08:30');
  const [isochrones, setIsochrones] = useState<ParsedIsochrone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number } | null>(null);
  const fetchRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pc = params.get('postcode');
    const time = params.get('time');
    const modes = params.get('modes');
    const dep = params.get('departure');

    if (time) setTravelTime(Number(time));
    if (modes) setActiveModes(modes.split(',') as TransportMode[]);
    if (dep) setDepartureTime(dep);
    // URL params restored via location name (no auto-geocode on reload for now)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!locationName) return;
    const params = new URLSearchParams();
    params.set('location', locationName);
    params.set('time', String(travelTime));
    params.set('modes', activeModes.join(','));
    params.set('departure', departureTime);
    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [locationName, travelTime, activeModes, departureTime]);

  const loadIsochrones = useCallback(
    async (lat: number, lng: number, modes: TransportMode[], minutes: number, depTime: string) => {
      if (modes.length === 0) {
        setIsochrones([]);
        return;
      }

      const id = ++fetchRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const results = await fetchIsochrones({
          lat,
          lng,
          modes,
          timeBands: getTimeBands(minutes),
          departureTime: buildDepartureISO(depTime),
        });

        if (id === fetchRef.current) {
          setIsochrones(parseResults(results));
        }
      } catch (err) {
        if (id === fetchRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load isochrones');
        }
      } finally {
        if (id === fetchRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const handleLocationSelect = useCallback(
    (location: LocationResult) => {
      setError(null);
      setLocationName(location.name);
      setDistrict(location.district);
      setOrigin({ lat: location.lat, lng: location.lng });
      setFlyToTarget({ lat: location.lat, lng: location.lng });
      loadIsochrones(location.lat, location.lng, activeModes, travelTime, departureTime);
    },
    [activeModes, travelTime, departureTime, loadIsochrones]
  );

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setOrigin({ lat, lng });
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setDistrict(null);
      loadIsochrones(lat, lng, activeModes, travelTime, departureTime);
    },
    [activeModes, travelTime, departureTime, loadIsochrones]
  );

  const handleLeaderboardSelect = useCallback(
    (lat: number, lng: number, name: string) => {
      setOrigin({ lat, lng });
      setLocationName(name);
      setDistrict(null);
      setFlyToTarget({ lat, lng });
      loadIsochrones(lat, lng, activeModes, travelTime, departureTime);
    },
    [activeModes, travelTime, departureTime, loadIsochrones]
  );

  useEffect(() => {
    if (origin) {
      loadIsochrones(origin.lat, origin.lng, activeModes, travelTime, departureTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModes, travelTime, departureTime]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0c13]">
      <Map origin={origin} isochrones={isochrones} onMapClick={handleMapClick} flyToTarget={flyToTarget} />
      <ControlPanel
        onLocationSelect={handleLocationSelect}
        currentLocation={locationName}
        currentDistrict={district}
        travelTime={travelTime}
        onTravelTimeChange={setTravelTime}
        activeModes={activeModes}
        onModesChange={setActiveModes}
        departureTime={departureTime}
        onDepartureTimeChange={setDepartureTime}
        isochrones={isochrones}
        isLoading={isLoading}
        origin={origin}
        onLeaderboardSelect={handleLeaderboardSelect}
      />
      {error && (
        <div className="absolute bottom-4 right-4 z-20 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm max-w-sm">
          {error}
        </div>
      )}
    </main>
  );
}
