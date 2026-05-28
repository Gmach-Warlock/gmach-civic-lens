import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async (formData: Record<string, string>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access-token");
      const response = await axios.patch(
        "http://localhost:4000/api/auth/me",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
    } catch (err: unknown) {
      // Narrowing the 'unknown' type so the linter (and logic) is happy
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Update failed");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);
