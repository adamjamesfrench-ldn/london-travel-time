import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import * as turf from '@turf/turf';
import { getSamplePoints, type SamplePoint } from '../src/data/sample-points';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '..', '.env.local') });

const APP_ID = process.env.NEXT_PUBLIC_TRAVELTIME_APP_ID!;
const API_KEY = process.env.TRAVELTIME_API_KEY!;
const API_URL = 'https://api.traveltimeapp.com/v4/time-map';

const TRAVEL_TIME_MINUTES = 30;
const DELAY_BETWEEN_BATCHES_MS = 6000;
const PROGRESS_FILE = resolve(__dirname, '..', 'src', 'data', 'coverage-progress.json');
const OUTPUT_FILE = resolve(__dirname, '..', 'src', 'data', 'coverage-results.json');

const MODES = [
  { key: 'walking', type: 'walking' },
  { key: 'cycling', type: 'cycling' },
  { key: 'transit', type: 'public_transport' },
  { key: 'driving', type: 'driving' },
  { key: 'multimodal', type: 'driving+public_transport' },
] as const;

interface PointResult {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  zone?: string;
  coverage: Record<string, number>;
}

interface ProgressData {
  results: PointResult[];
}

interface TravelTimeShape {
  shell: Array<{ lat: number; lng: number }>;
  holes: Array<Array<{ lat: number; lng: number }>>;
}

interface TravelTimeSearchResult {
  search_id: string;
  shapes: TravelTimeShape[];
}

function getNextWeekdayMorning(): string {
  const now = new Date();
  const date = new Date(now);
  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() === 0 || date.getDay() === 6);
  date.setHours(8, 30, 0, 0);
  return date.toISOString();
}

function shapesToGeoJSON(shapes: TravelTimeShape[]): GeoJSON.Feature<GeoJSON.MultiPolygon> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: shapes.map((shape) => {
        const shell = shape.shell.map((p) => [p.lng, p.lat]);
        shell.push(shell[0]);
        const holes = (shape.holes || []).map((hole) => {
          const ring = hole.map((p) => [p.lng, p.lat]);
          ring.push(ring[0]);
          return ring;
        });
        return [shell, ...holes];
      }),
    },
  };
}

function calculateAreaKm2(feature: GeoJSON.Feature<GeoJSON.MultiPolygon>): number {
  try {
    return turf.area(feature) / 1_000_000;
  } catch {
    return 0;
  }
}

async function fetchBatch(
  searches: Array<{
    id: string;
    coords: { lat: number; lng: number };
    departure_time: string;
    travel_time: number;
    transportation: { type: string };
  }>
): Promise<TravelTimeSearchResult[]> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Application-Id': APP_ID,
      'X-Api-Key': API_KEY,
    },
    body: JSON.stringify({ departure_searches: searches }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TravelTime API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.results || [];
}

function loadProgress(): ProgressData {
  // First check the progress file (in-flight data)
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  // Fall back to the output file (previously completed runs)
  if (existsSync(OUTPUT_FILE)) {
    const output = JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'));
    if (output.points) {
      console.log(`Loaded ${output.points.length} points from previous results.`);
      return { results: output.points };
    }
  }
  return { results: [] };
}

function saveProgress(data: ProgressData) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!APP_ID || !API_KEY) {
    console.error('Missing NEXT_PUBLIC_TRAVELTIME_APP_ID or TRAVELTIME_API_KEY in .env.local');
    process.exit(1);
  }

  const allPoints = getSamplePoints();
  console.log(`Total sample points: ${allPoints.length}`);

  const progress = loadProgress();
  const completedIds = new Set(progress.results.map((r) => r.id));
  const remaining = allPoints.filter((p) => !completedIds.has(p.id));
  console.log(`Already computed: ${completedIds.size}, remaining: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All points already computed. Building final output...');
    await buildOutput(progress.results, allPoints);
    return;
  }

  const departureTime = getNextWeekdayMorning();
  console.log(`Using departure time: ${departureTime}`);

  // Process points in pairs (2 points × 5 modes = 10 searches per API call)
  for (let i = 0; i < remaining.length; i += 2) {
    const batch = remaining.slice(i, i + 2);
    const batchNum = Math.floor(i / 2) + 1;
    const totalBatches = Math.ceil(remaining.length / 2);

    console.log(`Batch ${batchNum}/${totalBatches}: ${batch.map((p) => p.name).join(', ')}`);

    const searches = batch.flatMap((point) =>
      MODES.map((mode) => ({
        id: `${point.id}__${mode.key}`,
        coords: { lat: point.lat, lng: point.lng },
        departure_time: departureTime,
        travel_time: TRAVEL_TIME_MINUTES * 60,
        transportation: { type: mode.type },
      }))
    );

    try {
      const results = await fetchBatch(searches);

      for (const point of batch) {
        const coverage: Record<string, number> = {};

        for (const mode of MODES) {
          const searchId = `${point.id}__${mode.key}`;
          const result = results.find((r) => r.search_id === searchId);
          if (result && result.shapes.length > 0) {
            const geojson = shapesToGeoJSON(result.shapes);
            coverage[mode.key] = parseFloat(calculateAreaKm2(geojson).toFixed(1));
          }
        }

        progress.results.push({
          id: point.id,
          name: point.name,
          lat: point.lat,
          lng: point.lng,
          type: point.type,
          coverage,
        });
      }

      saveProgress(progress);
    } catch (err) {
      console.error(`  Error: ${err instanceof Error ? err.message : err}`);
      console.error(`  Skipping batch, will retry on next run.`);
    }

    if (i + 2 < remaining.length) {
      await sleep(DELAY_BETWEEN_BATCHES_MS);
    }
  }

  await buildOutput(progress.results, allPoints);
}

async function enrichGridNames(results: PointResult[]): Promise<void> {
  const gridPoints = results.filter((r) => r.type === 'grid' && r.name.startsWith('Grid '));
  if (gridPoints.length === 0) return;

  console.log(`\nEnriching ${gridPoints.length} grid point names via postcodes.io...`);

  for (const point of gridPoints) {
    try {
      const res = await fetch(
        `https://api.postcodes.io/postcodes?lon=${point.lng}&lat=${point.lat}&limit=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.result && data.result.length > 0) {
          const pc = data.result[0];
          const ward = pc.admin_ward || pc.admin_district || pc.postcode;
          point.name = ward;
        }
      }
      // Small delay to be polite to postcodes.io
      await sleep(100);
    } catch {
      // Keep the grid coordinate name as fallback
    }
  }
}

function classifyZone(lat: number, lng: number): string {
  const R = 6371;
  const cLat = 51.5074, cLng = -0.1278;
  const dLat = ((lat - cLat) * Math.PI) / 180;
  const dLng = ((lng - cLng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((cLat * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  if (dist <= 3) return 'central';
  if (dist <= 8) return 'inner';
  if (dist <= 15) return 'mid';
  return 'outer';
}

async function buildOutput(results: PointResult[], allPoints: SamplePoint[]) {
  await enrichGridNames(results);

  // Add zone classification
  for (const point of results) {
    point.zone = classifyZone(point.lat, point.lng);
  }
  const zoneCounts = results.reduce((acc, p) => { acc[p.zone!] = (acc[p.zone!] || 0) + 1; return acc; }, {} as Record<string, number>);
  console.log('\nZone distribution:', zoneCounts);

  // Build leaderboards - top 20 per mode
  const modeKeys = MODES.map((m) => m.key);
  const leaderboards: Record<string, string[]> = {};

  for (const mode of modeKeys) {
    const sorted = results
      .filter((r) => r.coverage[mode] !== undefined && r.coverage[mode] > 0)
      .sort((a, b) => (b.coverage[mode] || 0) - (a.coverage[mode] || 0));
    leaderboards[mode] = sorted.slice(0, 20).map((r) => r.id);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    travelTimeMinutes: TRAVEL_TIME_MINUTES,
    totalPoints: results.length,
    points: results,
    leaderboards,
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nResults written to ${OUTPUT_FILE}`);
  console.log(`Total points: ${results.length}`);

  // Print top 5 per mode
  for (const mode of modeKeys) {
    console.log(`\nTop 5 by ${mode}:`);
    for (const id of leaderboards[mode].slice(0, 5)) {
      const point = results.find((r) => r.id === id);
      if (point) {
        console.log(`  ${point.name}: ${point.coverage[mode]} km²`);
      }
    }
  }

  // Clean up progress file (data is now safe in the output file)
  if (existsSync(PROGRESS_FILE)) {
    const { unlinkSync } = require('fs');
    unlinkSync(PROGRESS_FILE);
    console.log('\nProgress file cleaned up (results preserved in output file).');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
