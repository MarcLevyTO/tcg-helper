import { useLocalStorage } from "@/src/hooks/useLocalStorage";

const DEFAULT_DISTANCE = "15";

export const useEventDistance = () => {
  const [getEventDistance, setEventDistance] = useLocalStorage('eventDistance');

  const saveEventDistance = ({ distance }: { distance: string }) => {
    setEventDistance(distance);
  };

  const eventDistance = getEventDistance();

  return {
    eventDistance,
    saveEventDistance,
  };
}