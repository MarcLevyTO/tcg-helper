import { NextResponse } from 'next/server';
import { getEventApiUrl } from '@/src/utils/url';

const fetchEventDetails = async (eventId: string): Promise<any> => {
  const apiUrl = getEventApiUrl(eventId);

  console.log(apiUrl);

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
    const roundInfo: any[] = [];
    eventData.tournament_phases.forEach((tournamentPhase: any) => {
      tournamentPhase.rounds.forEach((round: any) => {
        roundInfo.push({
          id: round.id,
          round_number: round.round_number,
          pairings_status: round.pairings_status,
          standings_status: round.standings_status,
          status: round.status,
        });
      });
    });

    const responseData: any = {
      id: eventData.id,
      name: eventData.name,
      full_header_image_url: eventData.full_header_image_url,
      start_datetime: eventData.start_datetime,
      rounds: roundInfo,
      registered_user_count: eventData.registered_user_count,
      full_address: eventData.event_address_override || eventData.full_address,
      store_name: eventData.store.name,
      game_type: eventData.game_type,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error fetching event data:', error.message);
    return NextResponse.json({ error: `Error fetching data: ${error.message}` }, { status: 500 });
  }
};

