import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_GAME, DEFAULT_COORDINATES, DEFAULT_DISTANCE } from "@/src/constants";
import { createStorageAccessor } from "@/src/utils/storage";

const [getLatitude, setLatitude] = createStorageAccessor<string>('latitude');
const [getLongitude, setLongitude] = createStorageAccessor<string>('longitude');
const [getEventDistance, setSavedEventDistance] = createStorageAccessor<string>('eventDistance');
const [, setSavedShowPastEvents] = createStorageAccessor<boolean>('showPastEvents');

interface HeaderState {
  activeTab: 'riftbound' | 'lorcana';
  latitude: string;
  longitude: string;
  eventDistance: string;
  eventNameFilter: string;
  storeNameFilter: string;
  showPastEvents: boolean;
}

const initialState: HeaderState = {
  activeTab: DEFAULT_GAME,
  latitude: getLatitude() || DEFAULT_COORDINATES.LATITUDE,
  longitude: getLongitude() || DEFAULT_COORDINATES.LONGITUDE,
  eventDistance: getEventDistance() || DEFAULT_DISTANCE,
  eventNameFilter: '',
  storeNameFilter: '',
  showPastEvents: false, // Always start false to prevent hydration mismatch
};

export const headerSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setActiveTab: (state, action: { payload: 'riftbound' | 'lorcana' }) => {
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
      setSavedShowPastEvents(action.payload);
      state.showPastEvents = action.payload;
    },
  },
});

export const { setActiveTab, setLocation, setEventDistance, setEventNameFilter, setStoreNameFilter, setShowPastEvents } = headerSlice.actions;

export default headerSlice.reducer;