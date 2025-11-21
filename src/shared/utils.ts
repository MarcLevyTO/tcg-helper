import { ics } from 'calendar-link';

const NUM_MILES = 15;
const PAGE_SIZE = 500;

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

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Groups events by week, then by day within each week
export const groupEventsByWeekByDay = (events: any[], latitude: string, longitude: string) => {
  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

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

  // Group each week's events by day, then sort by distance
  return Array.from(grouped)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([weekStart, weekEvents]) => {
      const dayGroups = groupEventsByDay(weekEvents);
      
      // Sort events within each day by distance
      const sortedDayGroups = dayGroups.map(([dayStart, dayEvents]) => {
        const sortedEvents = dayEvents.sort((a: any, b: any) => {
          const distA = calculateDistance(userLat, userLon, a.store.latitude, a.store.longitude);
          const distB = calculateDistance(userLat, userLon, b.store.latitude, b.store.longitude);
          return distA - distB;
        });
        return [dayStart, sortedEvents];
      });
      
      return [weekStart, sortedDayGroups];
    });
};

// Utility function to format today's date for API URLs
const getTodayFormatted = () => {
  const date = new Date();
  return date.toISOString().replace(/:/g, '%3A');
};

export const RIFTBOUND_EVENTS_URL = 'https://locator.riftbound.uvsgames.com/events/';
export const LORCANA_EVENTS_URL = 'https://tcg.ravensburgerplay.com/events/';


export const getRiftboundAPIUrl = (latitude: string, longitude: string, distance: string) => {
  const today = getTodayFormatted();
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/?start_date_after=${today}&display_status=all&latitude=${latitude}&longitude=${longitude}&num_miles=${distance}&game_slug=riftbound&page=1&page_size=${PAGE_SIZE}`;
}

export const getLorcanaAPIUrl = (latitude: string, longitude: string, distance: string) => {
  const today = getTodayFormatted();
  return `https://api.cloudflare.ravensburgerplay.com/hydraproxy/api/v2/events/?start_date_after=${today}&display_status=all&latitude=${latitude}&longitude=${longitude}&num_miles=${distance}&game_slug=disney-lorcana&page=1&page_size=${PAGE_SIZE}`;
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

export const getEventUrl = (eventId: string | number, activeTab: string) => {
  const baseUrl = activeTab === 'riftbound' ? RIFTBOUND_EVENTS_URL : LORCANA_EVENTS_URL;
  return `${baseUrl}${eventId}`;
};

export const formatCost = (cents: number | undefined, currency: string = 'USD') => {
  if (!cents) return 'Price TBD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(cents / 100);
};

export const ensureHttps = (url: string) => {
  return url.startsWith('https://') ? url : `https://${url}`;
};

export const registrationString = (event: any) => {
  if (event.settings.event_lifecycle_status === 'REGISTRATION_CLOSED') {
    return 'REGISTRATION PENDING';
  }

  if (event.registered_user_count - event.capacity >= 0) {
    return '** EVENT FULL **';
  }
  
  return `${event.registered_user_count} REGISTERED`;
}