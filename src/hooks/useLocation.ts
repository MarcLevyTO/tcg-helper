import { useLocalStorage } from "@/src/hooks/useLocalStorage";

const DEFAULT_LOCATION = {
  latitude: "43.7418",
  longitude: "-79.5734",
};

export const useLocation = () => {
  const [getLatitude, setLatitude] = useLocalStorage('latitude');
  const [getLongitude, setLongitude] = useLocalStorage('longitude');

  const saveLocation = ({ latitude, longitude }: { latitude: string; longitude: string }) => {
    setLatitude(latitude);
    setLongitude(longitude);
  };

  const latitude = getLatitude() || DEFAULT_LOCATION.latitude;
  const longitude = getLongitude() || DEFAULT_LOCATION.longitude;

  return {
    latitude,
    longitude,
    saveLocation,
  };
}