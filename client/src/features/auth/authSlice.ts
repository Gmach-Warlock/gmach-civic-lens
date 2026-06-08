import type { SerializedError } from "@reduxjs/toolkit";
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
    const handlePending = (state: AuthStateInterface) => {
      state.loadingState.state = "loading";
      state.loadingState.message = "Loading...";
    };

    const handleRejected = (
      state: AuthStateInterface,
      action: { error: SerializedError }, // Explicitly type the action
    ) => {
      state.loadingState.state = "idle";
      state.loadingState.message = action.error.message || "An error occurred";

      // Ensure user is cleared if auth fails
      state.user = createInitialUserState().user;
    };

    // 1. REGISTER USER
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(registerUser.fulfilled, (state, action) => {
        // Fixed!
        const { accessToken, refreshToken, user } = action.payload;

        state.loadingState.state = "idle";

        // Fixed: Preserve existing meta properties
        state.user = {
          ...user,
          meta: {
            ...user.meta,
            accessToken,
            refreshToken,
          },
        };

        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("refresh-token", refreshToken);
      });

    // 2. LOGIN USER
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(loginUser.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload;
        state.loadingState.state = "idle";
        state.user = { ...user, meta: { accessToken, refreshToken } };
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("refresh-token", refreshToken);
      });

    // 3. VERIFY TOKEN
    builder
      .addCase(verifyToken.pending, handlePending)
      .addCase(verifyToken.rejected, handleRejected) // THIS IS WHAT WAS MISSING!
      .addCase(verifyToken.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload;
        state.loadingState.state = "idle";
        state.user = { ...user, meta: { accessToken, refreshToken } };
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("refresh-token", refreshToken);
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
