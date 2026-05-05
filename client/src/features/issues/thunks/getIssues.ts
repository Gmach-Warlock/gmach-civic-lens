import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../../app/store/store";

export const getIssues = createAsyncThunk(
  "issues/getIssues",
  async (_, { getState, rejectWithValue }) => {
    try {
      const getIssuesUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_GET_ALL_ISSUES_PATH}`;
      const state = getState() as RootState;
      const accessToken = state.auth.user.meta.accessToken;

      const response = await axios(getIssuesUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);
