import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import globalReducer from "../../features/global/globalSlice";
import issuesReducer from "../../features/issues/issuesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    global: globalReducer,
    issues: issuesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
