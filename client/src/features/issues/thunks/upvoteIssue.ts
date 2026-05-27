// features/issues/thunks/upvoteIssue.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";
import type { IssueInterface } from "../../../app/interfaces/issuesInterfaces";
import type { AuthStateInterface } from "../../../app/interfaces/authInterfaces";

interface RootState {
  auth: AuthStateInterface;
}

export const upvoteIssue = createAsyncThunk<
  { message: string; issues: IssueInterface[] }, // Fulfilled Payload structure
  string, // Arg: Target issue ID string
  { state: RootState }
>("issues/upvoteIssue", async (issueId, thunkApi) => {
  try {
    const upvoteUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_CREATE_ISSUE_PATH}/${issueId}/upvote`;

    const state = thunkApi.getState();
    const accessToken =
      state.auth.user.meta.accessToken || localStorage.getItem("access-token");

    if (!accessToken) {
      return thunkApi.rejectWithValue({
        message: "No valid access token found.",
      });
    }

    // Dumb Request: Empty body payload, authorized via headers
    const response = await axios.patch(
      upvoteUrl,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return thunkApi.rejectWithValue(
        error.response?.data || { message: "Server Error" },
      );
    }
    return thunkApi.rejectWithValue({
      message: "An unexpected error occurred",
    });
  }
});
