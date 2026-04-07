'use client';

import { useEffect, useState } from 'react';
import LocationSearch, { type LocationResult } from './LocationSearch';
import TimeSlider from './TimeSlider';
import ModeToggles from './ModeToggles';
import TimePicker from './TimePicker';
import StatsPanel from './StatsPanel';
import Leaderboard from './Leaderboard';
import ThemeToggle from './ThemeToggle';
import BottomSheet from './BottomSheet';
import type { TransportMode, DayType } from '@/lib/constants';
import type { ParsedIsochrone } from '@/lib/geo-utils';

interface ControlPanelProps {
  onLocationSelect: (location: LocationResult) => void;
  currentLocation: string | null;
  currentDistrict: string | null;
  travelTime: number;
  onTravelTimeChange: (minutes: number) => void;
  activeModes: TransportMode[];
  onModesChange: (modes: TransportMode[]) => void;
  departureTime: string;
  onDepartureTimeChange: (time: string) => void;
  dayType: DayType;
  onDayTypeChange: (dayType: DayType) => void;
  isochrones: ParsedIsochrone[];
  isLoading: boolean;
  origin: { lat: number; lng: number } | null;
  onLeaderboardSelect: (lat: number, lng: number, name: string) => void;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

function PanelContent({
  onLocationSelect,
  currentLocation,
  currentDistrict,
  travelTime,
  onTravelTimeChange,
  activeModes,
  onModesChange,
  departureTime,
  onDepartureTimeChange,
  dayType,
  onDayTypeChange,
  isochrones,
  isLoading,
  origin,
  onLeaderboardSelect,
  isMobile,
}: ControlPanelProps & { isMobile: boolean }) {
  return (
    <div className={`space-y-5 ${isMobile ? 'px-4 pb-4' : 'p-5 space-y-6'}`}>
      <LocationSearch onSelect={onLocationSelect} initialValue={currentLocation || ''} />
      <TimeSlider value={travelTime} onChange={onTravelTimeChange} />
      <ModeToggles activeModes={activeModes} onChange={onModesChange} />
      <TimePicker value={departureTime} onChange={onDepartureTimeChange} dayType={dayType} onDayTypeChange={onDayTypeChange} />

      {isLoading && (
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <div
            className="w-3 h-3 rounded-full animate-spin"
            style={{ border: '1px solid var(--accent-border)', borderTopColor: 'var(--accent)' }}
          />
          Loading isochrones...
        </div>
      )}

      <StatsPanel
        postcode={currentLocation}
        district={currentDistrict}
        isochrones={isochrones}
        origin={origin}
      />

      <Leaderboard onSelectLocation={onLeaderboardSelect} />
    </div>
  );
}

export default function ControlPanel(props: ControlPanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <BottomSheet>
        {/* Compact mobile header inside the scrollable area */}
        <div className="flex items-center justify-between px-4 pb-2">
          <h1 className="text-base font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            London Travel Time
          </h1>
          <ThemeToggle />
        </div>
        <PanelContent {...props} isMobile />
        <div className="px-4 py-3 text-[10px] text-center" style={{ color: 'var(--text-faint)' }}>
          Data: TravelTime API &middot; Mapbox
        </div>
      </BottomSheet>
    );
  }

  // Desktop: sidebar layout (unchanged)
  return (
    <div
      className="absolute top-4 left-4 bottom-4 w-[300px] z-10 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--panel-border)' }}>
        <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          London Travel Time
        </h1>
        <ThemeToggle />
      </div>

      <div className="flex-1 overflow-y-auto">
        <PanelContent {...props} isMobile={false} />
      </div>

      <div className="p-4 text-[10px] text-center" style={{ borderTop: '1px solid var(--panel-border)', color: 'var(--text-faint)' }}>
        Data: TravelTime API &middot; Mapbox
      </div>
    </div>
  );
}
