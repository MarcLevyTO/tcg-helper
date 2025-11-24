import { NextResponse } from 'next/server';
import { getAPIUrl } from '@/src/shared/utils';
import { DEFAULT_GAME, DEFAULT_COORDINATES, DEFAULT_DISTANCE } from '@/src/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const game = searchParams.get('game') ?? DEFAULT_GAME;
  const latitude = searchParams.get('latitude') ?? DEFAULT_COORDINATES.LATITUDE;
  const longitude = searchParams.get('longitude') ?? DEFAULT_COORDINATES.LONGITUDE;
  const distance = searchParams.get('distance') ?? DEFAULT_DISTANCE;
  
  const apiUrl = getAPIUrl(game as 'riftbound' | 'lorcana', latitude, longitude, distance);
  
  try {
    console.log('Fetching data from URL:', apiUrl);
    const response = await fetch(apiUrl, { cache: 'force-cache',  next: { revalidate: 30 * 60 * 10 } });
    const data = await response.json();
    return NextResponse.json(data.results);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}