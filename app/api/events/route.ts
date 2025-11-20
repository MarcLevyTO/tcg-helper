import { NextResponse } from 'next/server';
import { getRiftboundAPIUrl, getLorcanaAPIUrl } from '@/src/shared/utils';

const LATITUDE = "43.7418592";
const LONGITUDE = "-79.57345579999999";
const DISTANCE = "15";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const game = searchParams.get('game');
  const latitude = searchParams.get('latitude') ?? LATITUDE;
  const longitude = searchParams.get('longitude') ?? LONGITUDE;
  const distance = searchParams.get('distance') ?? 'DISTANCE';
  let url: string;

  if (game === 'riftbound') {
    url = getRiftboundAPIUrl(latitude, longitude, distance);
  } else if (game === 'lorcana') {
    url = getLorcanaAPIUrl(latitude, longitude, distance);
  } else {
    return NextResponse.json({ error: 'Invalid game parameter' }, { status: 400 });
  }

  try {
    console.log('Fetching data from URL:', url);
    const response = await fetch(url, { cache: 'force-cache',  next: { revalidate: 30 * 60 * 10 } });
    const data = await response.json();
    return NextResponse.json(data.results);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}