import { google, outlook, office365, yahoo, ics } from 'calendar-link';

export const getTodayFormatted = () => {
  const date = new Date();
  date.setHours(8, 0, 0, 0);
  return date.toISOString().replace(/:/g, '%3A');
};

export const newDateFormatted = (date: Date) => {
  return date.toISOString().replace(/:/g, '%3A');
}

export const generateCalendarLinks = (event: any) => {
  const calendarEvent = {
    title: event.name,
    start: new Date(event.start_datetime).toISOString(),
    end: new Date(new Date(event.start_datetime).getTime() + 3 * 60 * 60 * 1000).toISOString(),
    description: event.description,
    location: `${event.store.name} ${event.store.full_address}`,
    url: event.game_type === 'RIFTBOUND' ? `https://locator.riftbound.uvsgames.com/events/${event.id}/` : `https://tcg.ravensburgerplay.com/events/${event.id}/`
  };

  return {
    google: google(calendarEvent),
    outlook: outlook(calendarEvent),
    office365: office365(calendarEvent),
    yahoo: yahoo(calendarEvent),
    ics: ics(calendarEvent)
  };
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

export const groupEventsByWeekByDay = (events: any[], latitude: string, longitude: string, showPastEvents: boolean = false) => {
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

  return Array.from(grouped)
    .sort((a, b) => {
      const timeA = new Date(a[0]).getTime();
      const timeB = new Date(b[0]).getTime();
      // If showPastEvents is true, reverse the order (newest first)
      return showPastEvents ? timeB - timeA : timeA - timeB;
    })
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

      // If showPastEvents is true, reverse the days within each week
      const finalDayGroups = showPastEvents ? sortedDayGroups.reverse() : sortedDayGroups;

      return [weekStart, finalDayGroups];
    });
};

export const formatCost = (cents: number | undefined, currency: string = 'USD') => {
  if (!cents) return 'TBD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(cents / 100);
};

export const ensureHttps = (url: string) => {
  if (!url) {
    return '';
  }
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