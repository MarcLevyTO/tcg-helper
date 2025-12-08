import { useQuery } from '@tanstack/react-query';
import { getTodayFormatted } from '@/src/utils/utils';

export const useEvents = (latitude: string, longitude: string, distance: string, game: string) => {
  const date = getTodayFormatted();
  return useQuery({
    queryKey: ['events', game, latitude, longitude, distance, date],
    queryFn: async () => {
      const apiUrl = (latitude && longitude) ? `/api/events?game=${game}&latitude=${latitude}&longitude=${longitude}&distance=${distance}&date=${date}` : `/api/events?game=${game}&distance=${distance}&date=${date}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};