import { createSlice } from "@reduxjs/toolkit";
import type { UserInterface } from "../../app/interfaces/userInterfaces";
import { createUser } from "./thunks/createUser";
import { loginUser } from "./thunks/loginUser";
import { createInitialUserState } from "../../app/utils/factory/stateFactories";

const initialUserState: UserInterface = createInitialUserState();

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    logoutUser: () => {},
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state) => {
      state.loadingState.state = "idle";
      state.loadingState.message = `User created successfully at ${new Date().toLocaleString()}`;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const { token } = action.payload;
      console.log(token);
      state.loadingState.state = "idle";
      state.loadingState.message = `User returned sucessfully at ${new Date().toLocaleString()}`;

      localStorage.setItem("token", token);
    });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
