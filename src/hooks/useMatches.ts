import { useQuery } from '@tanstack/react-query';

export const useMatches = (roundId: string) => {
  return useQuery({
    queryKey: ['matches', roundId],
    queryFn: async () => {
      if (!roundId) {
        return null;
      }
      const response = await fetch(`/api/matches?roundId=${roundId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};