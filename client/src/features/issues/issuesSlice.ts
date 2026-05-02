import { createSlice } from "@reduxjs/toolkit";
import { createIssue } from "./thunks/createIssue";
import { getIssues } from "./thunks/getIssues";
import type { IssuesStateInterface } from "../../app/interfaces/issuesInterfaces";

const initialIssuesState: IssuesStateInterface = {
  general: {
    issues: [],
    selectedIssueId: null,
    entities: null,
    ids: [],
  },
  meta: {
    accessToken: "",
    refreshToken: "",
    lastFetch: "",
  },
  state: {
    loading: false,
    loadingState: "idle",
    message: null,
  },
};

const issuesSlice = createSlice({
  name: "issues",
  initialState: initialIssuesState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createIssue.fulfilled, (state, action) => {
      console.log(action.payload);
      state.general.issues = action.payload.data;
    });
    builder.addCase(getIssues.fulfilled, (state, action) => {
      console.log(action.payload);
      state.general.issues = action.payload.data;
    });
  },
});

export default issuesSlice.reducer;
