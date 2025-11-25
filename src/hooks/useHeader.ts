import { useSelector, useDispatch } from "react-redux";
import { setActiveTab, setLocation, setEventDistance, setEventNameFilter } from "@/src/redux/headerSlice";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { useEffect } from "react";
import { get } from "http";

export const useHeader = () => {
  const headerData = useSelector((state: any) => state.header);
  const { activeTab, latitude, longitude, eventDistance, eventNameFilter } = headerData;
  const [getLatitude, setLatitude] = useLocalStorage('latitude');
  const [getLongitude, setLongitude] = useLocalStorage('longitude');
  const [getEventDistance, setSavedEventDistance] = useLocalStorage('eventDistance');
  const dispatch = useDispatch();

  useEffect(() => {
    const savedLatitude = getLatitude();
    const savedLongitude = getLongitude();

    if (latitude !== savedLatitude || longitude !== savedLongitude) {
      const location = {
        latitude: savedLatitude || latitude,
        longitude: savedLongitude || longitude,
      };
      dispatch(setLocation(location));
    }

    const savedDistance = getEventDistance();
    if (eventDistance !== savedDistance) {
      const distance = savedDistance || eventDistance;
      dispatch(setEventDistance(distance));
    }
  }, []);

  const saveActiveTab = (tab: 'riftbound' | 'lorcana') => {
    dispatch(setActiveTab(tab));
  };

  const saveLocation = (location: { latitude: string; longitude: string }) => {
    setLatitude(location.latitude);
    setLongitude(location.longitude);
    dispatch(setLocation(location));
  };

  const saveEventDistance = (distance: string ) => {
    setSavedEventDistance(distance);
    dispatch(setEventDistance(distance));
  };

  const saveEventNameFilter = (filter: string) => {
    dispatch(setEventNameFilter(filter));
  };

  return {
    activeTab,
    latitude,
    longitude,
    eventDistance,
    eventNameFilter,
    
    saveActiveTab,
    saveLocation,
    saveEventDistance,
    saveEventNameFilter,
  }
};