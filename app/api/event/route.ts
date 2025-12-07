import { NextResponse } from 'next/server';
import { getRiftboundEventUrl, getRiftboundRoundMatchesUrl, getRiftboundRoundStandingsUrl } from '@/src/shared/event';

const fetchEventDetails = async (eventId: string): Promise<any> => {
  const apiUrl = getRiftboundEventUrl(eventId);
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch event details: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const eventData = await fetchEventDetails(eventId);
    const roundInfo = eventData.tournament_phases[0]?.rounds.map((round: any) => {
      return {
        id: round.id,
        round_number: round.round_number,
        pairings_status: round.pairings_status,
        standings_status: round.standings_status,
        status: round.status,
      };
    });

    const responseData: any = {
      id: eventData.id,
      name: eventData.name,
      full_header_image_url: eventData.full_header_image_url,
      start_datetime: eventData.start_datetime,
      rounds: roundInfo,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error fetching event data:', error.message);
    return NextResponse.json({ error: `Error fetching data: ${error.message}` }, { status: 500 });
  }
};

