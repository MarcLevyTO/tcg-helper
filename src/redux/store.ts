import { configureStore } from '@reduxjs/toolkit';
import headerReducer from './headerSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    header: headerReducer,
    notifications: notificationsReducer,
  },
});