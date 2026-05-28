import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosError } from "axios";
import type { RootState } from "../../../app/store/store";
import type { IssueInterface } from "../../../app/interfaces/issuesInterfaces";

interface BackendErrorResponse {
  message?: string;
}

interface UpdateIssuePayload {
  id: string;
  title: string;
  description: string;
}

export const updateIssue = createAsyncThunk<
  IssueInterface, // Return payload type
  UpdateIssuePayload, // Input argument type
  { state: RootState } // Thunk API config
>(
  "issues/updateIssue",
  async ({ id, title, description }, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.user.meta.accessToken;

      const response = await axios.put(
        `http://localhost:4000/api/issues/${id}`,
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data; // Expecting the updated Issue object
    } catch (error: unknown) {
      // 1. Cast error as AxiosError to access response safely
      const axiosError = error as AxiosError<BackendErrorResponse>;

      // 2. Safely extract the message
      const errorMessage =
        axiosError.response?.data?.message || "Failed to update issue";

      return rejectWithValue(errorMessage);
    }
  },
);
