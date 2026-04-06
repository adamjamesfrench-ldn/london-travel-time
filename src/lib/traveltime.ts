import type { TransportMode } from './constants';
import { TRANSPORT_MODES } from './constants';

export interface TravelTimeCoord {
  lat: number;
  lng: number;
}

export interface TravelTimeShape {
  shell: TravelTimeCoord[];
  holes: TravelTimeCoord[][];
}

export interface TravelTimeResult {
  search_id: string;
  shapes: TravelTimeShape[];
}

export interface IsochroneRequest {
  lat: number;
  lng: number;
  modes: TransportMode[];
  timeBands: number[]; // minutes
  departureTime?: string;
}

export function buildDepartureSearches(req: IsochroneRequest) {
  const departureTime = req.departureTime || getDefaultDepartureTime();
  const searches: Array<{
    id: string;
    coords: TravelTimeCoord;
    departure_time: string;
    travel_time: number;
    transportation: { type: string };
  }> = [];

  for (const mode of req.modes) {
    const modeConfig = TRANSPORT_MODES[mode];
    for (const band of req.timeBands) {
      searches.push({
        id: `${mode}-${band}`,
        coords: { lat: req.lat, lng: req.lng },
        departure_time: departureTime,
        travel_time: band * 60,
        transportation: { type: modeConfig.travelTimeType },
      });
    }
  }

  return searches;
}

function getDefaultDepartureTime(): string {
  // Next weekday at 08:30
  const now = new Date();
  const date = new Date(now);
  // Move to next weekday
  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() === 0 || date.getDay() === 6);
  date.setHours(8, 30, 0, 0);
  return date.toISOString();
}

const MAX_SEARCHES_PER_REQUEST = 10;

export async function fetchIsochrones(req: IsochroneRequest): Promise<TravelTimeResult[]> {
  const allSearches = buildDepartureSearches(req);
  if (allSearches.length === 0) return [];

  // Batch into chunks of 10 (TravelTime API limit)
  const batches: typeof allSearches[] = [];
  for (let i = 0; i < allSearches.length; i += MAX_SEARCHES_PER_REQUEST) {
    batches.push(allSearches.slice(i, i + MAX_SEARCHES_PER_REQUEST));
  }

  const results = await Promise.all(
    batches.map(async (batch) => {
      const res = await fetch('/api/isochrone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departure_searches: batch }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Isochrone API error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      return (data.results || []) as TravelTimeResult[];
    })
  );

  return results.flat();
}
