import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";
import type {
  CreateIssueRequestInterface,
  IssueInterface,
} from "../../../app/interfaces/issuesInterfaces";
import type { AuthStateInterface } from "../../../app/interfaces/authInterfaces";

// Define a type for your global Redux RootState
interface RootState {
  auth: AuthStateInterface;
  // include other slices if needed
}

export const createIssue = createAsyncThunk<
  { message: string; issues: IssueInterface[] }, // Type of the fulfilled payload returned by backend
  CreateIssueRequestInterface, // Type of the first argument passed to dispatch
  { state: RootState } // Configuration type for thunkAPI fields
>("issues/createIssue", async (issueData, thunkApi) => {
  try {
    const createIssueUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_CREATE_ISSUE_PATH}`;

    // Pull the state directly from Redux Core instead of invoking a React Hook
    const state = thunkApi.getState();
    const accessToken =
      state.auth.user.meta.accessToken || localStorage.getItem("access-token");

    if (!accessToken) {
      return thunkApi.rejectWithValue({
        message: "No valid access token found. Please log in.",
      });
    }

    // Axios Request sending the clean request payload
    const response = await axios.post(createIssueUrl, issueData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Success:", response.data);

    // This returns { message: "...", issues: [...] } matching the backend formatter
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
