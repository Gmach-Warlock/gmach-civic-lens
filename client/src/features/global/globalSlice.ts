import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  GlobalStateInterface,
  ToastMessageInterface,
} from "../../app/interfaces/globalInterfaces";

const initialGlobalState: GlobalStateInterface = {
  theme: "dark",
  isSideBarOpen: false,
  status: "waiting",
  toasts: [], // Starts empty
};

const globalSlice = createSlice({
  name: "global",
  initialState: initialGlobalState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    toggleSidebar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    // Accepts a message and type, then appends a randomized unique ID for key tracking
    addToast: (
      state,
      action: PayloadAction<Omit<ToastMessageInterface, "id">>,
    ) => {
      state.toasts.push({
        ...action.payload,
        id: crypto.randomUUID(),
      });
    },
    // Filter out the specific toast card when it closes or times out
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload,
      );
    },
  },
});

export const { toggleTheme, toggleSidebar, addToast, removeToast } =
  globalSlice.actions;
export default globalSlice.reducer;
