import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import settingsReducer from "../features/settings/settingsSlice";
import issuesFilterReducer from "../features/issues/issuesFilterSlice";
import reportsReducer from "../features/reports/reportsSlice";
import { apiSlice } from "../services/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    issuesFilter: issuesFilterReducer,
    reports: reportsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;