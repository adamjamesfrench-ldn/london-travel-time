'use client';

import LocationSearch, { type LocationResult } from './LocationSearch';
import TimeSlider from './TimeSlider';
import ModeToggles from './ModeToggles';
import TimePicker from './TimePicker';
import StatsPanel from './StatsPanel';
import Leaderboard from './Leaderboard';
import type { TransportMode } from '@/lib/constants';
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
  isochrones: ParsedIsochrone[];
  isLoading: boolean;
  onLeaderboardSelect: (lat: number, lng: number, name: string) => void;
}

export default function ControlPanel({
  onLocationSelect,
  currentLocation,
  currentDistrict,
  travelTime,
  onTravelTimeChange,
  activeModes,
  onModesChange,
  departureTime,
  onDepartureTimeChange,
  isochrones,
  isLoading,
  onLeaderboardSelect,
}: ControlPanelProps) {
  return (
    <div
      className="absolute top-4 left-4 bottom-4 w-[300px] z-10 rounded-2xl overflow-hidden
                    flex flex-col"
      style={{
        background: 'rgba(10, 12, 19, 0.93)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="p-5 border-b border-white/5">
        <h1 className="text-lg font-semibold text-white tracking-tight">
          London Travel Time
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <LocationSearch onSelect={onLocationSelect} initialValue={currentLocation || ''} />
        <TimeSlider value={travelTime} onChange={onTravelTimeChange} />
        <ModeToggles activeModes={activeModes} onChange={onModesChange} />
        <TimePicker value={departureTime} onChange={onDepartureTimeChange} />

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="w-3 h-3 border border-[#00d4ff]/50 border-t-[#00d4ff] rounded-full animate-spin" />
            Loading isochrones...
          </div>
        )}

        <StatsPanel
          postcode={currentLocation}
          district={currentDistrict}
          isochrones={isochrones}
        />

        <Leaderboard onSelectLocation={onLeaderboardSelect} />
      </div>

      <div className="p-4 border-t border-white/5 text-[10px] text-white/20 text-center">
        Data: TravelTime API &middot; Mapbox
      </div>
    </div>
  );
}
