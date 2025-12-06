// LINK TO EVENT
// https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/291508/

const getEventUrl = (eventId: number) => {
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/${eventId}`;
};

// LINK TO ROUND STANDINGS
// https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/tournament-rounds/242699/standings/paginated/?page=1&page_size=10

const getRoundStandingsUrl = (roundId: number) => {
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/tournament-rounds/${roundId}/standings/paginated/?page=1&page_size=3000`;
};