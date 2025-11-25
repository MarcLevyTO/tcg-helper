import { useQuery } from '@tanstack/react-query';

export const useEventsForStore = (storeId: string, game: string) => {
  return useQuery({
    queryKey: ['events', game, storeId],
    queryFn: async () => {
      if (!storeId) {
        return [];
      }
      const apiUrl = `/api/events?game=${game}&storeId=${storeId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};