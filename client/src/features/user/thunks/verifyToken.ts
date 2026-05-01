import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const verifyToken = createAsyncThunk(
  "user/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");

      const response = await axios.get("http://localhost:4000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("test");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        localStorage.removeItem("token");
        return rejectWithValue(
          error.response?.data?.message || "Session expired",
        );
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("An unexpected error occurred");
    }
  },
);
