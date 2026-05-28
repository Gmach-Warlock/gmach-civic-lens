import { createSlice } from "@reduxjs/toolkit";
import { createIssue } from "./thunks/createIssue";
import { getIssues } from "./thunks/getIssues";
import { upvoteIssue } from "./thunks/upvoteIssue";
import { postComment } from "./thunks/postComment";
import { updateIssue } from "./thunks/updateIssue";
import { searchIssues } from "./thunks/searchIssues";

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
      // Spread into a new array to guarantee a reference change
      state.general.issues = [...action.payload.issues];
      state.state.loadingState = "fulfilled";
      // Update a message/timestamp to trigger your Dashboard useEffect
      state.state.message = `Fetched at ${new Date().getTime()}`;
    });
    // --- UPVOTE ISSUE FULFILLED ---
    builder.addCase(upvoteIssue.fulfilled, (state, action) => {
      if (action.payload && Array.isArray(action.payload.issues)) {
        const updatedIssue = action.payload.issues[0];
        if (!updatedIssue) return;

        const issueId = updatedIssue.meta.id;

        // Use .map to create a brand new array reference
        state.general.issues = state.general.issues.map((item) =>
          item.meta.id === issueId ? updatedIssue : item,
        );

        // Update message to trigger effect
        state.state.message = `Upvoted at ${new Date().getTime()}`;

        if (state.general.entities && state.general.entities[issueId]) {
          state.general.entities[issueId] = updatedIssue;
        }
      }
    });

    builder.addCase(postComment.pending, (state) => {
      state.state.loading = true;
      state.state.loadingState = "loading";
    });

    builder.addCase(postComment.fulfilled, (state, action) => {
      const { issueId, comment } = action.payload;
      state.state.loading = false;
      state.state.loadingState = "fulfilled";
      state.state.message = "Comment added successfully.";

      // 1. Mutate the main array target
      const targetIssue = state.general.issues.find(
        (issue) => issue.meta.id === issueId,
      );
      if (targetIssue) {
        targetIssue.social.comments.push(comment);
      }

      // 2. Mutate the key-value dictionary target for normalized state speed
      if (state.general.entities && state.general.entities[issueId]) {
        state.general.entities[issueId].social.comments.push(comment);
      }
    });

    builder.addCase(postComment.rejected, (state, action) => {
      state.state.loading = false;
      state.state.loadingState = "rejected";
      state.state.message = action.payload as string;
    });
    builder.addCase(updateIssue.pending, (state) => {
      state.state.loading = true;
      state.state.loadingState = "loading";
    });

    builder.addCase(updateIssue.fulfilled, (state, action) => {
      state.state.loading = false;
      state.state.loadingState = "fulfilled";
      state.state.message = "Issue updated successfully.";

      const updatedIssue = action.payload;
      if (!updatedIssue?.meta?.id) return;

      // STRICT IMMUTABILITY: Create a new array reference
      state.general.issues = [
        ...state.general.issues
          .filter((issue) => issue && issue.meta)
          .map((issue) =>
            issue.meta.id === updatedIssue.meta.id ? updatedIssue : issue,
          ),
      ];

      // Update normalized entity storage
      if (!state.general.entities) {
        state.general.entities = {};
      }
      state.general.entities[updatedIssue.meta.id] = updatedIssue;
    });

    builder.addCase(updateIssue.rejected, (state, action) => {
      state.state.loading = false;
      state.state.loadingState = "rejected";
      state.state.message = action.payload as string;
    });

    builder.addCase(searchIssues.fulfilled, (state, action) => {
      // Ensure this matches the structure { data: { issues: [...] } }
      // If action.payload is the entire response object, you might need action.payload.data.issues
      state.general.issues = action.payload.issues;
      state.state.loadingState = "fulfilled";
    });
  },
});

export default issuesSlice.reducer;
