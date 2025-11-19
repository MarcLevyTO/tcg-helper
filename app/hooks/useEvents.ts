import { useQuery } from '@tanstack/react-query';

// interface Event {
//   id: string;
//   name: string;
//   date: string;
//   location: string;
//   // Add other event properties as needed
// }

export const useEvents = (latitude: string, longitude: string, game: string) => {
  return useQuery({
    queryKey: ['events', latitude, longitude],
    queryFn: async () => {
      console.log('Fetching events for', { latitude, longitude, game });
      const apiUrl = (latitude && longitude) ? `/api/events?game=${game}&latitude=${latitude}&longitude=${longitude}` : `/api/events?game=${game}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
  });
};