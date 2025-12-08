import { NextResponse } from 'next/server';
import { getRoundMatchesUrl } from '@/src/shared/event';

const processPlayer = (playerRelationship: any): any => {
  return {
    id: playerRelationship.player.id,
    name: playerRelationship.player.best_identifier
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' '),
    userName: playerRelationship.user_event_status.best_identifier,
  };
};

const processMatch = (match: any): any => {
  const players = match.player_match_relationships.map(processPlayer);
  return {
    id: match.id,
    table_number: match.table_number,
    players,
    winning_player: match.winning_player,
    losing_player: match.losing_player,
    match_is_intentional_draw: match.match_is_intentional_draw,
    match_is_bye: match.match_is_bye,
    games_won_by_winner: match.games_won_by_winner,
    games_won_by_loser: match.games_won_by_loser,
  };
};

// const fetchAndProcessRoundMatches = async (roundId: string): Promise<any> => {
//   const roundMatchesUrl = getRoundMatchesUrl(roundId, '');
//   const response = await fetch(roundMatchesUrl);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch round matches for round ${roundId}: ${response.status} ${response.statusText}`);
//   }
//   const roundData = await response.json();
//   const matches = roundData.results.map(processMatch);
//   return {
//     page_size: roundData.page_size,
//     count: roundData.count,
//     total: roundData.total,
//     next_page_number: roundData.next_page_number,
//     previous_page_number: roundData.previous_page_number,
//     matches,
//   };
// };

// const fetchAndProcessRoundStandings = async (roundId: string): Promise<any> => {
//   const roundStandingsUrl = getRoundStandingsUrl(roundId);
//   const response = await fetch(roundStandingsUrl);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch round standings for round ${roundId}: ${response.status} ${response.statusText}`);
//   }
//   const roundData = await response.json();
//   console.log(roundData);

//   // const standings = roundData.results.map(processStandings);
//   // return {
//   //   page_size: roundData.page_size,
//   //   count: roundData.count,
//   //   total: roundData.total,
//   //   next_page_number: roundData.next_page_number,
//   //   previous_page_number: roundData.previous_page_number,
//   //   standings,
//   // };
//   return roundData;
// };

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const roundId = searchParams.get('roundId');

  if (!roundId) {
    return NextResponse.json({ error: 'Round ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(getRoundMatchesUrl(roundId));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      return NextResponse.json(
        { error: `Failed to fetch match data: ${response.status} ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.results.map(processMatch));
  } catch (error) {
    console.error('Error fetching match data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
