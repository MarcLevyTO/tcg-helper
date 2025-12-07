import { useQuery } from '@tanstack/react-query';

export const useStandings = (roundId: string) => {
  return useQuery({
    queryKey: ['standings', roundId],
    queryFn: async () => {
      if (!roundId) {
        return null;
      }
      const response = await fetch(`/api/standings?roundId=${roundId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch standings');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};