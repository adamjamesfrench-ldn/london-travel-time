/**
 * Targeted script to fix grid point names in coverage-results.json
 * ONLY updates names — does NOT touch coverage data, zones, or leaderboards.
 * Uses OpenStreetMap Nominatim reverse geocoding (no API key needed).
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const OUTPUT_FILE = resolve(__dirname, '..', 'src', 'data', 'coverage-results.json');

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  // Try Nominatim (OpenStreetMap) - free, no key needed, 1 req/sec
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LondonIsochroneMap/1.0' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      // Prefer: suburb > village > town > city_district > hamlet > neighbourhood
      const name =
        addr?.suburb ||
        addr?.village ||
        addr?.town ||
        addr?.city_district ||
        addr?.hamlet ||
        addr?.neighbourhood ||
        addr?.county;
      if (name && name !== 'Greater London' && name !== 'London' && name !== 'England') {
        return name;
      }
    }
  } catch {
    // Fall through
  }

  // Fallback: try postcodes.io (might work for some)
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.result && data.result.length > 0) {
        const pc = data.result[0];
        return pc.admin_ward || pc.admin_district || null;
      }
    }
  } catch {
    // Fall through
  }

  return null;
}

async function main() {
  // Read current data
  const data = JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'));
  const totalPoints = data.points.length;
  const totalCoverage = data.points.reduce(
    (sum: number, p: any) => sum + Object.keys(p.coverage || {}).length,
    0
  );
  console.log(`Loaded ${totalPoints} points with ${totalCoverage} total coverage entries`);

  // Find grid points that need names
  const gridPoints = data.points.filter(
    (p: any) => p.name.startsWith('Grid ')
  );
  console.log(`${gridPoints.length} grid points need names\n`);

  let fixed = 0;
  let failed = 0;

  for (const point of gridPoints) {
    const name = await reverseGeocode(point.lat, point.lng);
    if (name) {
      console.log(`  ${point.name} -> ${name}`);
      point.name = name;
      fixed++;
    } else {
      console.log(`  ${point.name} -> (no result, keeping as-is)`);
      failed++;
    }
    // Nominatim rate limit: 1 request per second
    await sleep(1100);
  }

  // Verify data integrity before saving
  const newTotalPoints = data.points.length;
  const newTotalCoverage = data.points.reduce(
    (sum: number, p: any) => sum + Object.keys(p.coverage || {}).length,
    0
  );

  if (newTotalPoints !== totalPoints) {
    console.error(`\nERROR: Point count changed (${totalPoints} -> ${newTotalPoints}). Aborting.`);
    process.exit(1);
  }
  if (newTotalCoverage !== totalCoverage) {
    console.error(
      `\nERROR: Coverage count changed (${totalCoverage} -> ${newTotalCoverage}). Aborting.`
    );
    process.exit(1);
  }

  console.log(`\nFixed: ${fixed}, Failed: ${failed}`);
  console.log(`Data integrity verified: ${newTotalPoints} points, ${newTotalCoverage} coverage entries`);

  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Saved to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
