import { useQuery } from '@tanstack/react-query';

export const useStores = (latitude: string, longitude: string, distance: string, game: string) => {
  return useQuery({
    queryKey: ['stores', game, latitude, longitude, distance],
    queryFn: async () => {
      const apiUrl = (latitude && longitude) ? `/api/stores?game=${game}&latitude=${latitude}&longitude=${longitude}&distance=${distance}` : `/api/stores?game=${game}&distance=${distance}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};