# London Travel Time

An interactive isochrone map showing everywhere reachable within a given time from any location in Greater London, by different transport modes.

Built with Next.js, Mapbox GL, and the TravelTime API.

## What It Does

- Enter any address, station name, or postcode and see a coloured overlay on the map showing how far you can travel in a given time
- Switch between transport modes: walking, cycling, public transport, driving, and multimodal (park & ride)
- Adjust travel time from 5 to 60 minutes with instant visual feedback
- Change departure time to see how public transport coverage varies throughout the day
- **Percentile ranking** — see how your chosen location compares to 456 pre-computed points across London ("Top 5% for transit across London")
- **Zone comparison** — compare against all London, same zone (central/inner/mid/outer), or central only
- **Coverage leaderboard** showing which London locations offer the best reach per mode, filterable by zone
- **Light/dark mode toggle** with preference saved to localStorage
- Click anywhere on the map to set a new origin point

## How It Works

The app uses three APIs:

1. **[TravelTime API](https://traveltime.com)** - Computes isochrone polygons using real GTFS timetable data (TfL tube, bus, DLR, Overground, Elizabeth line, National Rail), OpenStreetMap road networks, and proprietary routing models. Returns GeoJSON-like polygons shaped by actual transport networks.

2. **[Mapbox](https://mapbox.com)** - Map rendering (dark-v11 and light-v11 styles) via Mapbox GL JS, and location search via the Mapbox Search Box API (supports addresses, station names, postcodes, and place names).

3. **[postcodes.io](https://postcodes.io)** / **[OpenStreetMap Nominatim](https://nominatim.openstreetmap.org)** - Free reverse geocoding used in the coverage analysis scripts for naming grid points.

### Transport Modes

| Mode | What It Calculates |
|------|-------------------|
| Walking | Road/footpath network at ~5 km/h |
| Cycling | Road and cycle lane network |
| Public Transport | Any combination of tube, bus, DLR, rail + walking between stops. Time-dependent based on real timetables |
| Driving | Car travel on the road network |
| Multimodal | Drive to a station, then public transport (park & ride) |

Public transport isochrones are a combined view - there is no way to isolate "tube only" or "bus only" because real journeys combine modes.

### Zone Classification

Locations are classified into zones based on distance from central London (Charing Cross):

| Zone | Distance |
|------|----------|
| Central | 0 – 3 km |
| Inner | 3 – 8 km |
| Mid | 8 – 15 km |
| Outer | 15 km+ |

This powers the percentile comparisons and leaderboard zone filtering.

### Architecture

- **Next.js API route** (`/api/isochrone`) proxies requests to TravelTime so the API key stays server-side
- **Mapbox Search Box API** handles location search with autocomplete (suggest + retrieve flow)
- **CSS variable-based theming** with dark and light palettes, toggled via React context
- **Coverage data** is pre-computed via an offline analysis script and stored as a static JSON file (456 points across 5 transport modes)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### API Keys

You need three API credentials (all have free tiers):

1. **TravelTime API** - Sign up at [traveltime.com](https://traveltime.com)
   - You'll get an **Application ID** and an **API Key**
   - Free tier allows ~10 requests/minute, sufficient for interactive use

2. **Mapbox** - Sign up at [mapbox.com](https://account.mapbox.com/auth/signup/)
   - Copy your **default public token** from the account dashboard
   - Free tier includes 100,000 map loads/month and 100,000 geocoding requests/month

### Setup

```bash
# Clone the repository
git clone https://github.com/adamjamesfrench-ldn/london-travel-time.git
cd london-travel-time

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```
NEXT_PUBLIC_TRAVELTIME_APP_ID=your_traveltime_app_id
TRAVELTIME_API_KEY=your_traveltime_api_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
```

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Coverage Analysis (Optional)

The leaderboard and percentile data is pre-computed and included in the repo. To regenerate it with fresh data:

```bash
npm run analyze
```

This runs through 456 sample points across London (tube/rail stations + grid points at 3km spacing), computing isochrone areas for each of 5 transport modes. It takes about 30-60 minutes due to API rate limits. The script is resumable — if interrupted, just run it again and it will pick up where it left off.

To fix any unnamed grid points:

```bash
npx tsx scripts/fix-grid-names.ts
```

This reverse geocodes grid points via OpenStreetMap Nominatim to replace coordinate names with area names (e.g. "Grid 51.350, -0.232" becomes "Stoneleigh").

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Map**: Mapbox GL JS via react-map-gl
- **Styling**: Tailwind CSS + CSS variables for theming
- **Isochrones**: TravelTime API
- **Geocoding**: Mapbox Search Box API + postcodes.io + Nominatim
- **GeoJSON**: @turf/turf for area calculations

## Project Structure

```
src/
  app/
    page.tsx              # Main page with state management
    api/isochrone/route.ts # Server-side TravelTime API proxy
    globals.css           # CSS variables for dark/light themes
    layout.tsx            # Root layout with ThemeProvider
  components/
    Map.tsx               # Mapbox GL map with isochrone layers
    IsochroneLayer.tsx    # GeoJSON polygon rendering
    LocationSearch.tsx    # Mapbox Search Box autocomplete
    ControlPanel.tsx      # Side panel with all controls
    ModeToggles.tsx       # Transport mode switches
    TimeSlider.tsx        # Travel time control
    TimePicker.tsx        # Departure time selector
    StatsPanel.tsx        # Area stats + percentile ranking
    Leaderboard.tsx       # Coverage rankings with zone filter
    ThemeToggle.tsx       # Light/dark mode switch
    OriginMarker.tsx      # Pulsing origin dot
  lib/
    constants.ts          # Colours, modes, defaults
    traveltime.ts         # TravelTime request builder
    geo-utils.ts          # Shape conversion + area calc
    zones.ts              # Zone classification (central/inner/mid/outer)
    theme.tsx             # Theme context + provider
  data/
    sample-points.ts      # 456 station coords + grid generator
    coverage-results.json # Pre-computed coverage data (456 points × 5 modes)
scripts/
  analyze-coverage.ts     # Offline coverage analysis (resumable)
  fix-grid-names.ts       # Reverse geocode unnamed grid points
```

## License

MIT
