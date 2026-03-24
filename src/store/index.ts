import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import locationsReducer from './slices/locationsSlice';
import subscribersReducer from './slices/subscribersSlice';
import eventsReducer from './slices/eventsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locations: locationsReducer,
    subscribers: subscribersReducer,
    events: eventsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
