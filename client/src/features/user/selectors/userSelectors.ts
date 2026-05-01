import type { RootState } from "../../../app/store/store";

export const selectUser = (state: RootState) => state.user.user;

export const selectAccessToken = (state: RootState) =>
  state.user.user.meta.accessToken;

export const selectRefreshToken = (state: RootState) =>
  state.user.user.meta.refreshToken;

export const selectUsername = (state: RootState) =>
  state.user.user.general.username;
