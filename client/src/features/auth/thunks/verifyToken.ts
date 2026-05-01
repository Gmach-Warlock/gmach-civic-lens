import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const verifyToken = createAsyncThunk(
  "user/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const vefifyTokenUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_VERIFY_TOKEN_PATH}`;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");

      const response = await axios.get(vefifyTokenUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
