import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_GAME, DEFAULT_COORDINATES, DEFAULT_DISTANCE } from "@/src/constants";

const initialState = {
  activeTab: DEFAULT_GAME,
  latitude: DEFAULT_COORDINATES.LATITUDE,
  longitude: DEFAULT_COORDINATES.LONGITUDE,
  eventDistance: DEFAULT_DISTANCE,
  eventNameFilter: '',
};

export const headerSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setEventDistance: (state, action) => {
      console.log('Setting event distance to:', action);
      state.eventDistance = action.payload;
    },
    setEventNameFilter: (state, action) => {
      state.eventNameFilter = action.payload;
    },
  },
});

export const { setActiveTab, setLocation, setEventDistance, setEventNameFilter } = headerSlice.actions;

export default headerSlice.reducer;