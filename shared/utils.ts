import { ics } from 'calendar-link';

const LATITUDE = 43.7418592;
const LONGITUDE = -79.57345579999999;
const NUM_MILES = 12;
const PAGE_SIZE = 250;

export const generateICS = (event: any) => {
  const icsEvent = {
    title: event.name,
    start: new Date(event.start_datetime).toISOString(),
    end: new Date(new Date(event.start_datetime).getTime() + 3 * 60 * 60 * 1000).toISOString(),
    description: `Event at ${event.store?.name || 'Unknown Location'}`,
    location: `${event.store.name} ${event.store.full_address}`,
    url: event.game_type === 'RIFTBOUND' ? `https://locator.riftbound.uvsgames.com/events/${event.id}/` : `https://tcg.ravensburgerplay.com/events/${event.id}/`
  };
  return ics(icsEvent);
};

export const groupEventsByWeek = (events: any[]) => {
  const weeks: { [key: string]: any[] } = {};
  events.forEach((event) => {
    const eventDate = new Date(event.start_datetime);
    const monday = new Date(eventDate);
    monday.setDate(eventDate.getDate() - ((eventDate.getDay() + 6) % 7)); // Get the Monday of the week
    const weekKey = monday.toISOString().split('T')[0]; // Use Monday's date as the key
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(event);
  });
  return weeks;
};

// Groups events by day, returning a sorted array of [date, events] pairs
export const groupEventsByDay = (events: any[]) => {
  const grouped = new Map();
  
  events.forEach(event => {
    const date = new Date(event.start_datetime);
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString();
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(event);
  });

  return Array.from(grouped)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
};

// Groups events by week, then by day within each week
export const groupEventsByWeekByDay = (events: any[]) => {
  const grouped = new Map();
  
  events.forEach(event => {
    const date = new Date(event.start_datetime);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    const key = monday.toISOString();
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(event);
  });

  // Group each week's events by day
  return Array.from(grouped)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([weekStart, weekEvents]) => [
      weekStart,
      groupEventsByDay(weekEvents)
    ]);
};

// Utility function to format today's date for API URLs
const getTodayFormatted = () => {
  const date = new Date();
  return date.toISOString().replace(/:/g, '%3A');
};

export const RIFTBOUND_EVENTS_URL = 'https://locator.riftbound.uvsgames.com/events/';
export const LORCANA_EVENTS_URL = 'https://tcg.ravensburgerplay.com/events/';

export const getRiftboundAPIUrl = () => {
  const today = getTodayFormatted();
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/?start_date_after=${today}&display_status=all&latitude=${LATITUDE}&longitude=${LONGITUDE}&num_miles=${NUM_MILES}&game_slug=riftbound&page=1&page_size=${PAGE_SIZE}`;
}

export const getLorcanaAPIUrl = () => {
  const today = getTodayFormatted();
  return `https://api.cloudflare.ravensburgerplay.com/hydraproxy/api/v2/events/?start_date_after=${today}&display_status=all&latitude=${LATITUDE}&longitude=${LONGITUDE}&num_miles=${NUM_MILES}&game_slug=disney-lorcana&page=1&page_size=${PAGE_SIZE}`;
}

export const getRiftboundStoreLink = (storeId: number) => {
  const today = getTodayFormatted();
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/?start_date_after=${today}&display_status=upcoming&store_id=${storeId}&upcoming_only=true&game_slug=riftbound&page=1&page_size=${PAGE_SIZE}`;
}

export const getLorcanaStoreLink = (storeId: number) => {
  const today = getTodayFormatted();
  return `https://api.cloudflare.ravensburgerplay.com/hydraproxy/api/v2/events/?start_date_after=${today}&display_status=upcoming&store_id=${storeId}&upcoming_only=true&game_slug=disney-lorcana&page=1&page_size=${PAGE_SIZE}`;
}

export const getGoogleMapsUrl = (store: any) => {
  const query = encodeURIComponent(`${store.name} ${store.full_address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

export const getEventUrl = (eventId: string, activeTab: string) => {
  const baseUrl = activeTab === 'riftbound' ? RIFTBOUND_EVENTS_URL : LORCANA_EVENTS_URL;
  return `${baseUrl}${eventId}`;
};

export const formatCost = (cents: number | undefined) => {
  if (!cents) return 'View Event Details';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CAD'
  }).format(cents / 100);
};

export const ensureHttps = (url: string) => {
  return url.startsWith('https://') ? url : `https://${url}`;
};