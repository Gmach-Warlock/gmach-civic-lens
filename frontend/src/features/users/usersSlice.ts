import { createSlice } from "@reduxjs/toolkit";
import type { UserInterface } from "../../app/interfaces/userInterfaces";
import { createUser } from "./thunks/createUser";
import { createInitialUsersState } from "../../app/utils/factory/stateFactories";

const initialUserState: UserInterface = createInitialUsersState();

const usersSlice = createSlice({
  name: "users",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state) => {
      state.loadingState.state = "succeeded";
      state.loadingState.message = `User created successfully at ${new Date().toLocaleString()}`;
    });
  },
});

export default usersSlice.reducer;
