import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../../app/store/store";

export const searchIssues = createAsyncThunk(
  "issues/searchIssues",
  async (searchTerm: string, { rejectWithValue, getState }) => {
    try {
      // 1. Get the state
      const state = getState() as RootState;

      // 2. Access the token directly from your auth slice
      // Adjust 'auth' if your slice name is different
      const token = state.auth.user.meta.accessToken;

      // 3. Include the Authorization header
      const response = await axios.get(
        `/api/issues?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("response is: ", response);

      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Search failed";
      return rejectWithValue(message);
    }
  },
);
