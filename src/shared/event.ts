// GET EVENT API URL
export const getEventUrl = (eventId: string) => {
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/${eventId}`;
};

// GET ROUND MATCHES API URL
export const getRoundMatchesUrl = (roundId: string, playerName?: string) => {
  let url = `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/tournament-rounds/${roundId}/matches/paginated/?page=1&page_size=1000`;
  if (playerName) {
    url += `&player_name=${playerName}`;
  }
  return url;
};

// GET ROUND STANDINGS API URL
export const getRoundStandingsUrl = (roundId: string) => {
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/tournament-rounds/${roundId}/standings/paginated/?page=1&page_size=1000`;
};