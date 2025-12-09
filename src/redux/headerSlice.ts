import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_GAME, DEFAULT_COORDINATES, DEFAULT_DISTANCE } from "@/src/constants";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";

const [getLatitude, setLatitude] = useLocalStorage('latitude');
const [getLongitude, setLongitude] = useLocalStorage('longitude');
const [getEventDistance, setSavedEventDistance] = useLocalStorage('eventDistance');

const initialState = {
  activeTab: DEFAULT_GAME,
  latitude: getLatitude() || DEFAULT_COORDINATES.LATITUDE,
  longitude: getLongitude() || DEFAULT_COORDINATES.LONGITUDE,
  eventDistance: getEventDistance() || DEFAULT_DISTANCE,
  eventNameFilter: '',
  storeNameFilter: '',
  showPastEvents: false,
};

export const headerSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setLocation: (state, action) => {
      setLatitude(action.payload.latitude);
      setLongitude(action.payload.longitude);
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setEventDistance: (state, action) => {
      setSavedEventDistance(action.payload);
      state.eventDistance = action.payload;
    },
    setEventNameFilter: (state, action) => {
      state.eventNameFilter = action.payload;
    },
    setStoreNameFilter: (state, action) => {
      state.storeNameFilter = action.payload;
    },
    setShowPastEvents: (state, action) => {
      state.showPastEvents = action.payload;
    },
  },
});

export const { setActiveTab, setLocation, setEventDistance, setEventNameFilter, setStoreNameFilter, setShowPastEvents } = headerSlice.actions;

export default headerSlice.reducer;