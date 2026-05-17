import type { RootState } from "../../app/store/store";

export const selectTheme = (state: RootState) => state.global.theme;
