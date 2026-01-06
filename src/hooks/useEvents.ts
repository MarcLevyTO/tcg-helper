import { useQuery } from '@tanstack/react-query';
import { getTodayFormatted, newDateFormatted } from '@/src/utils/utils';

export const useEvents = (latitude: string, longitude: string, distance: string, game: string, showPastEvents: boolean) => {
  let startDate = getTodayFormatted();
  let endDate = null;

  if (showPastEvents) {
    startDate = newDateFormatted(new Date(2025, 0, 1));
    endDate = getTodayFormatted();
  }

  return useQuery({
    queryKey: ['events', game, latitude, longitude, distance, startDate, endDate],
    queryFn: async () => {
      let apiUrl;
      apiUrl = (latitude && longitude) ? `/api/events?game=${game}&latitude=${latitude}&longitude=${longitude}&distance=${distance}&date=${startDate}` : `/api/events?game=${game}&distance=${distance}&date=${startDate}`;
      if (endDate) {
        apiUrl += `&endDate=${endDate}`;
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};