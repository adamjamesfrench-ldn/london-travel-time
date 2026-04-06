import { NextRequest, NextResponse } from 'next/server';

const TRAVELTIME_APP_ID = process.env.NEXT_PUBLIC_TRAVELTIME_APP_ID!;
const TRAVELTIME_API_KEY = process.env.TRAVELTIME_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch('https://api.traveltimeapp.com/v4/time-map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Application-Id': TRAVELTIME_APP_ID,
        'X-Api-Key': TRAVELTIME_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `TravelTime API error: ${res.status}`, details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
