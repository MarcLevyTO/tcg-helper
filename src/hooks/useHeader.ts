import { useSelector, useDispatch } from "react-redux";
import { setActiveTab, setLocation, setEventDistance, setEventNameFilter, setStoreNameFilter } from "@/src/redux/headerSlice";

export const useHeader = () => {
  const headerData = useSelector((state: any) => state.header);
  const { activeTab, latitude, longitude, eventDistance, eventNameFilter, storeNameFilter } = headerData;
  const dispatch = useDispatch();

  const saveActiveTab = (tab: 'riftbound' | 'lorcana') => {
    dispatch(setActiveTab(tab));
  };

  const saveLocation = (location: { latitude: string; longitude: string }) => {
    dispatch(setLocation(location));
  };

  const saveEventDistance = (distance: string) => {
    dispatch(setEventDistance(distance));
  };

  const saveEventNameFilter = (filter: string) => {
    dispatch(setEventNameFilter(filter));
  };

  const saveStoreNameFilter = (filter: string) => {
    dispatch(setStoreNameFilter(filter));
  };

  return {
    activeTab,
    latitude,
    longitude,
    eventDistance,
    eventNameFilter,
    storeNameFilter,

    saveActiveTab,
    saveLocation,
    saveEventDistance,
    saveEventNameFilter,
    saveStoreNameFilter,
  }
};