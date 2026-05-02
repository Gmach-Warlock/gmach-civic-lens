import { createSlice } from "@reduxjs/toolkit";
import type { StatusType } from "../../app/types/issuesTypes";

export type GlobalThemeType = "light" | "dark";
export type GlobalToastType = "info" | "alert";

export interface GlobalStateInterface {
  theme: GlobalThemeType;
  isSideBarOpen: boolean;
  status: StatusType;
  toast: {
    message: string | null;
    type: GlobalToastType | null;
  };
}

const initialGlobalState: GlobalStateInterface = {
  theme: "dark",
  isSideBarOpen: false,
  status: "waiting",
  toast: {
    message: null,
    type: null,
  },
};

const globalSlice = createSlice({
  name: "global",
  initialState: initialGlobalState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
});

export const { toggleTheme } = globalSlice.actions;
export default globalSlice.reducer;
