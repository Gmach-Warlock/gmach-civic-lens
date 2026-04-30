import type { RootState } from "../../../app/store/store";

export const selectUser = (state: RootState) => state.user.user;

export const selectToken = (state: RootState) => state.user.user.meta.token;
