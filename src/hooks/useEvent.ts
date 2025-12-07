import { useQuery } from '@tanstack/react-query';

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) {
        return null;
      }
      const response = await fetch(`/api/event?eventId=${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};