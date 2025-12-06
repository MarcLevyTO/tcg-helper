import { NextResponse } from 'next/server';
import { getRiftboundEventUrl, getRiftboundRoundMatchesUrl } from '@/src/shared/event';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  const apiUrl = getRiftboundEventUrl(parseInt(eventId));

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const swissRoundUrls: string[] = [];

    data.tournament_phases[0].rounds.forEach((round: any) => {
      swissRoundUrls.push(getRiftboundRoundMatchesUrl(round.id, ''));
    })

    const roundData = await Promise.all(swissRoundUrls.map((url: string) => fetch(url).then((res) => res.json())));
    const rounds: Record<string, any> = {};

    roundData.forEach((round: any, index: number) => {
      rounds[`round${index + 1}`] = round;
    })

    return NextResponse.json({
      id: data.id,
      full_header_image_url: data.full_header_image_url,
      start_datetime: data.start_datetime,
      rounds: rounds,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}