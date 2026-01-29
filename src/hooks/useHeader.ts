import { useSelector, useDispatch } from "react-redux";
import { setActiveTab, setLocation, setEventDistance, setEventNameFilter, setStoreNameFilter, setShowPastEvents } from "@/src/redux/headerSlice";
import { RootState } from "@/src/redux/store";

export const useHeader = () => {
  const headerData = useSelector((state: RootState) => state.header);
  const { activeTab, latitude, longitude, eventDistance, eventNameFilter, storeNameFilter, showPastEvents } = headerData;
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

  const saveShowPastEvents = (showPastEvents: boolean) => {
    dispatch(setShowPastEvents(showPastEvents));
  };

  return {
    activeTab,
    latitude,
    longitude,
    eventDistance,
    eventNameFilter,
    storeNameFilter,
    showPastEvents,
    saveActiveTab,
    saveLocation,
    saveEventDistance,
    saveEventNameFilter,
    saveStoreNameFilter,
    saveShowPastEvents,
  }
};