import type { RootState } from "../../../app/store/store";

// The core objects
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserGeneral = (state: RootState) => state.auth.user.general;
export const selectUserMeta = (state: RootState) => state.auth.user.meta;

// Specific General Info
export const selectUsername = (state: RootState) =>
  state.auth.user.general.username;
export const selectUserEmail = (state: RootState) =>
  state.auth.user.general.email;
export const selectUserFullName = (state: RootState) =>
  `${state.auth.user.general.firstName} ${state.auth.user.general.lastName}`;
export const selectUserZipCode = (state: RootState) =>
  state.auth.user.general.zipCode;

// Added for your Theme logic
export const selectUserTheme = (state: RootState) => state.auth.user.meta.theme;

// Auth Tokens
export const selectAccessToken = (state: RootState) =>
  state.auth.user.meta.accessToken;
export const selectRefreshToken = (state: RootState) =>
  state.auth.user.meta.refreshToken;

// Activity/Status
export const selectIsAdmin = (state: RootState) => state.auth.user.meta.isAdmin;
export const selectAuthLoadingState = (state: RootState) =>
  state.auth.loadingState;
