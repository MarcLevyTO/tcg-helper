import { NextResponse } from 'next/server';
import { getEventsAPIUrl, getEventsForStoreAPIUrl } from '@/src/utils/url';
import { DEFAULT_GAME, DEFAULT_COORDINATES, DEFAULT_DISTANCE } from '@/src/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const game = searchParams.get('game') ?? DEFAULT_GAME;
  const latitude = searchParams.get('latitude') ?? DEFAULT_COORDINATES.LATITUDE;
  const longitude = searchParams.get('longitude') ?? DEFAULT_COORDINATES.LONGITUDE;
  const date = searchParams.get('date') ?? new Date().toISOString().replace(/:/g, '%3A');
  const endDate = searchParams.get('endDate');
  const distance = searchParams.get('distance') ?? DEFAULT_DISTANCE;
  const storeId = searchParams.get('storeId');

  let apiUrl;
  if (storeId) {
    apiUrl = getEventsForStoreAPIUrl(game as 'riftbound' | 'lorcana', storeId, date, endDate);
  } else {
    apiUrl = getEventsAPIUrl(game as 'riftbound' | 'lorcana', latitude, longitude, distance, date, endDate);
  }

  try {
    const response = await fetch(apiUrl, { cache: 'force-cache', next: { revalidate: 30 * 60 * 10 } });
    const data = await response.json();
    return NextResponse.json(data.results);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}