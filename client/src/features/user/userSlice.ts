import { createSlice } from "@reduxjs/toolkit";
import type { UserInterface } from "../../app/interfaces/userInterfaces";
import { createUser } from "./thunks/createUser";
import { loginUser } from "./thunks/loginUser";
import { createInitialUserState } from "../../app/utils/factory/stateFactories";

const initialUserState: UserInterface = {
  ...createInitialUserState(),
  user: {
    ...createInitialUserState().user,
    meta: {
      ...createInitialUserState().user.meta,
      token: localStorage.getItem("token") || "",
    },
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    logoutUser: () => {
      localStorage.removeItem("token");
      createInitialUserState();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      state.loadingState.state = "idle";
      state.user = user;
      state.user.meta.token = token;
      localStorage.setItem("token", token);
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      console.log(token);
      state.loadingState.state = "idle";
      state.loadingState.message = `User returned sucessfully at ${new Date().toLocaleString()}`;
      state.user = user;
      state.user.meta.token = token;
      localStorage.setItem("token", token);
    });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
