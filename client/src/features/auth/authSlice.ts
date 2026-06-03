import type { AuthStateInterface } from "../../app/interfaces/authInterfaces";
import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "./thunks/registerUser";
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
      localStorage.removeItem("refresh-token");
      return createInitialUserState();
    },
  },
  extraReducers: (builder) => {
    // 1. REGISTER USER HANDLER
    builder.addCase(registerUser.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;

      state.loadingState.state = "idle";
      state.user = user;
      state.user.meta.accessToken = accessToken;
      state.user.meta.refreshToken = refreshToken;

      localStorage.setItem("access-token", accessToken);
      localStorage.setItem("refresh-token", refreshToken);
    });

    // 2. LOGIN USER HANDLER
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      console.log(accessToken, refreshToken);

      state.loadingState.state = "idle";
      state.loadingState.message = `User returned successfully at ${new Date().toLocaleString()}`;

      state.user = user;
      state.user.meta.accessToken = accessToken;
      state.user.meta.refreshToken = refreshToken;

      localStorage.setItem("access-token", accessToken);
      localStorage.setItem("refresh-token", refreshToken);
    });

    // 3. VERIFY TOKEN HANDLER
    builder.addCase(verifyToken.pending, (state) => {
      state.loadingState.state = "loading";
      state.loadingState.message = "Verifying session...";
    });

    builder.addCase(verifyToken.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;

      state.loadingState.state = "idle";
      state.loadingState.message = `User verified successfully at ${new Date().toLocaleString()}`;

      state.user = user;
      state.user.meta.accessToken = accessToken;
      state.user.meta.refreshToken = refreshToken;

      localStorage.setItem("access-token", accessToken);
      localStorage.setItem("refresh-token", refreshToken);
    });

    builder.addCase(verifyToken.rejected, (state, action) => {
      state.loadingState.state = "idle"; // Crucial: move out of loading
      state.loadingState.message =
        (action.payload as string) || "Verification failed";

      // Reset user state on failure
      state.user = createInitialUserState().user;

      // Clean up storage
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
    });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
