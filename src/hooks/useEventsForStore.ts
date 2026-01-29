import { useQuery } from '@tanstack/react-query';
import { getTodayFormatted } from '@/src/utils/utils';

export const useEventsForStore = (storeId: string | number | null, game: string) => {
  const date = getTodayFormatted();
  return useQuery({
    queryKey: ['events', game, storeId],
    queryFn: async () => {
      if (!storeId) {
        return [];
      }
      const apiUrl = `/api/events?game=${game}&storeId=${storeId}&date=${date}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};