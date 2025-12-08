import { NextResponse } from 'next/server';
import { getRoundStandingsUrl } from '@/src/shared/event';

const processStanding = (standing: any): any => {
  return {
    player_id: standing.player.id,
    player_name: standing.player.best_identifier,
    player_username: standing.user_event_status.best_identifier,
    match_record: standing.match_record,
    match_points: standing.match_points,
    opponent_match_win_percentage: standing.opponent_match_win_percentage,
    opponent_game_win_percentage: standing.opponent_game_win_percentage,
    matches_won: standing.user_event_status.matches_won,
    matches_drawn: standing.user_event_status.matches_drawn,
    matches_lost: standing.user_event_status.matches_lost,
    total_match_points: standing.user_event_status.total_match_points,
    rank: standing.rank,
    points: standing.points,
  };
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const roundId = searchParams.get('roundId');

  if (!roundId) {
    return NextResponse.json({ error: 'Round ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(getRoundStandingsUrl(roundId));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      return NextResponse.json(
        { error: `Failed to fetch match data: ${response.status} ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.results.map(processStanding));
  } catch (error) {
    console.error('Error fetching match data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
