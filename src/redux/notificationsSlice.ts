import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showNotification: false,
  notificationMessage: "",
};

export const notificationsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setNotificationMessage: (state, action) => {
      state.notificationMessage = action.payload;
    },
    setShowNotification: (state, action) => {
      state.showNotification = action.payload;
    },
  },
});

export const { setNotificationMessage, setShowNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;