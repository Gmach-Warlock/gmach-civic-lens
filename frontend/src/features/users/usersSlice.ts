import { createSlice } from "@reduxjs/toolkit";
import type {
  UserInterface,
  FetchUsersInterface,
} from "../../app/interfaces/userInterfaces";
import { createUser } from "./thunks/createUser";
import { initialIssueState } from "../../assets/users/usersAssets";

const initialUserState: UserInterface & FetchUsersInterface = {
  general: { fullName: "", username: "", email: "" },
  activity: { requests: [], comments: [] },
  meta: { createdAt: new Date(), lastLogin: new Date(), isAdmin: false },
  ...initialIssueState, // Spread it here
};

const usersSlice = createSlice({
  name: "users",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state) => {
      state.loading = false; // Use a semicolon here
      state.isSuccess = true;
    });
  },
});

export default usersSlice.reducer;
