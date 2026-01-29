import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_RIFTBOUND_API_URL,
  DEFAULT_LORCANA_API_URL,
} from '@/src/constants';
import { Store } from '@/src/types';

const getBaseUrl = (game: 'riftbound' | 'lorcana' = 'riftbound') => game === 'riftbound' ? DEFAULT_RIFTBOUND_API_URL : DEFAULT_LORCANA_API_URL;

export const getEventApiUrl = (eventId: string, game: 'riftbound' | 'lorcana' = 'riftbound') => `${getBaseUrl(game)}/events/${eventId}`;

export const getRoundStandingsUrl = (roundId: string, game: 'riftbound' | 'lorcana' = 'riftbound') => `${getBaseUrl(game)}/tournament-rounds/${roundId}/standings/paginated/?page=1&page_size=1000`;

export const getRoundMatchesUrl = (roundId: string, playerName?: string, game?: 'riftbound' | 'lorcana') => {
  let url = `${getBaseUrl(game)}/tournament-rounds/${roundId}/matches/paginated/?page=1&page_size=1000`;
  if (playerName) {
    url += `&player_name=${playerName}`;
  }
  return url;
};

export const getEventsAPIUrl = (game: 'riftbound' | 'lorcana', latitude: string, longitude: string, distance: string, startDate: string, endDate?: string | null) => {
  const gameSlug = game === 'riftbound' ? 'riftbound' : 'disney-lorcana';
  let url = `${getBaseUrl(game)}/events/?start_date_after=${startDate}&display_status=all&latitude=${latitude}&longitude=${longitude}&num_miles=${distance}&game_slug=${gameSlug}&page=1&page_size=${DEFAULT_PAGE_SIZE}`;
  if (endDate) {
    url += `&start_date_before=${endDate}`;
  }
  return url;
}

export const getEventsForStoreAPIUrl = (game: 'riftbound' | 'lorcana', storeId: string, startDate: string, endDate?: string | null) => {
  const gameSlug = game === 'riftbound' ? 'riftbound' : 'disney-lorcana';
  let url = `${getBaseUrl(game)}/events/?start_date_after=${startDate}&display_status=all&store_id=${storeId}&game_slug=${gameSlug}&page=1&page_size=${DEFAULT_PAGE_SIZE}`;
  if (endDate) {
    url += `&start_date_before=${endDate}`;
  }
  return url;
}

export const getStoresAPIUrl = (game: 'riftbound' | 'lorcana', latitude: string, longitude: string, distance: string) => {
  return `${getBaseUrl(game)}/game-stores/?latitude=${latitude}&longitude=${longitude}&num_miles=${distance}&game_id=3&page=1&page_size=${DEFAULT_PAGE_SIZE}`;
}

export const getEventUrl = (eventId: string | number, activeTab: string) => {
  const baseUrl = activeTab === 'riftbound' ? 'https://locator.riftbound.uvsgames.com/events/' : 'https://tcg.ravensburgerplay.com/events/';
  return `${baseUrl}${eventId}`;
};

export const getGoogleMapsUrl = (store: Store) => {
  const query = encodeURIComponent(`${store.name} ${store.full_address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};