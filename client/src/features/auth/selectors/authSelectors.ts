import type { RootState } from "../../../app/store/store";

export const selectUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) =>
  state.auth.user.meta.accessToken;

export const selectRefreshToken = (state: RootState) =>
  state.auth.user.meta.refreshToken;

export const selectUsername = (state: RootState) =>
  state.auth.user.general.username;

export const selectUserZipCode = (state: RootState) =>
  state.auth.user.general.zipCode;
