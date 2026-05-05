import type { AuthStateInterface } from "../../app/interfaces/authInterfaces";
import { createSlice } from "@reduxjs/toolkit";
import { createUser } from "./thunks/createUser";
import { loginUser } from "./thunks/loginUser";
import { createInitialUserState } from "../../app/utils/factory/stateFactories";
import { verifyToken } from "./thunks/verifyToken";

const initialAuthState: AuthStateInterface = {
  ...createInitialUserState(),
  user: {
    ...createInitialUserState().user,
    meta: {
      ...createInitialUserState().user.meta,
      accessToken: localStorage.getItem("access-token") || "",
      refreshToken: localStorage.getItem("refresh-token") || "",
    },
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logoutUser: () => {
      localStorage.removeItem("access-token");
      return createInitialUserState();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.loadingState.state = "idle";
      state.user = user;
      state.user.meta.accessToken = accessToken;
      state.user.meta.refreshToken = refreshToken;
      localStorage.setItem("access-token", accessToken);
      localStorage.setItem("refresh-token", refreshToken);
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      console.log(accessToken, refreshToken);
      state.loadingState.state = "idle";
      state.loadingState.message = `User returned sucessfully at ${new Date().toLocaleString()}`;
      state.user = user;
      state.user.meta.accessToken = accessToken;
      state.user.meta.refreshToken = refreshToken;
      localStorage.setItem("access-token", accessToken);
      localStorage.setItem("refresh-token", refreshToken);
    });
    builder.addCase(verifyToken.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      console.log(accessToken, refreshToken);
      state.loadingState.state = "idle";
      state.loadingState.message = `User verified sucessfully at ${new Date().toLocaleString()}`;
      state.user = user;
      state.user.meta.accessToken = accessToken;
      state.user.meta.refreshToken = refreshToken;
      localStorage.setItem("access-token", accessToken);
      localStorage.setItem("refresh-token", refreshToken);
    });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
