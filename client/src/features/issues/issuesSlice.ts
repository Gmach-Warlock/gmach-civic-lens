import { createSlice } from "@reduxjs/toolkit";
import { createIssue } from "./thunks/createIssue";
import { getIssues } from "./thunks/getIssues";
import { upvoteIssue } from "./thunks/upvoteIssue";

import type { IssuesStateInterface } from "../../app/interfaces/issuesInterfaces";

interface RejectedErrorPayload {
  message?: string;
  error?: string;
}

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
    // --- CREATE ISSUE PENDING ---
    builder.addCase(createIssue.pending, (state) => {
      state.state.loading = true;
      state.state.loadingState = "loading";
      state.state.message = null;
    });

    // --- CREATE ISSUE FULFILLED ---
    builder.addCase(createIssue.fulfilled, (state, action) => {
      state.state.loading = false;
      state.state.loadingState = "fulfilled";
      state.state.message =
        action.payload.message || "Issue created successfully";

      // action.payload matches: { message: string, issues: IssueInterface[] }
      if (action.payload && action.payload.issues) {
        // Correct path alignment matching initialIssuesState structure
        state.general.issues = [
          ...action.payload.issues,
          ...state.general.issues,
        ];
      }
    });

    // --- CREATE ISSUE REJECTED ---
    builder.addCase(createIssue.rejected, (state, action) => {
      state.state.loading = false;
      state.state.loadingState = "rejected";
      const payload = action.payload as RejectedErrorPayload | undefined;
      state.state.message =
        payload?.message ||
        payload?.error ||
        action.error.message ||
        "Failed to create issue";
    });

    // --- GET ISSUES FULFILLED ---
    builder.addCase(getIssues.fulfilled, (state, action) => {
      console.log(action.payload.issues);
      state.general.issues = action.payload.issues;
      state.state.loadingState = "fulfilled";
    });
    builder.addCase(upvoteIssue.fulfilled, (state, action) => {
      if (action.payload && Array.isArray(action.payload.issues)) {
        const updatedIssue = action.payload.issues[0];
        if (!updatedIssue) return;

        const issueId = updatedIssue.meta.id;

        // 1. Update standard array item match
        const index = state.general.issues.findIndex(
          (item) => item.meta.id === issueId,
        );
        if (index !== -1) {
          state.general.issues[index] = updatedIssue;
        }

        // 2. Update normalized entity storage item match
        if (state.general.entities && state.general.entities[issueId]) {
          state.general.entities[issueId] = updatedIssue;
        }
      }
    });
  },
});

export default issuesSlice.reducer;
