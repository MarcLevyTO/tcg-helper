import { NextResponse } from 'next/server';
import { getRiftboundAPIUrl, getLorcanaAPIUrl } from '../../../src/shared/utils';

const LATITUDE = "43.7418592";
const LONGITUDE = "-79.57345579999999";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const game = searchParams.get('game');
  const latitude = searchParams.get('latitude') ?? LATITUDE;
  const longitude = searchParams.get('longitude') ?? LONGITUDE;
  let url: string;

  if (game === 'riftbound') {
    url = getRiftboundAPIUrl(latitude, longitude);
  } else if (game === 'lorcana') {
    url = getLorcanaAPIUrl(latitude, longitude);
  } else {
    return NextResponse.json({ error: 'Invalid game parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data.results);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}