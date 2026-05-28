import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios"; // 👈 Imported AxiosError
import type { RootState } from "../../../app/store/store";
import type { CommentInterface } from "../../../app/interfaces/issuesInterfaces";

interface PostCommentPayload {
  issueId: string;
  content: string;
}

// Define the shape of your expected backend error response
interface BackendErrorResponse {
  message?: string;
  error?: string;
}

export const postComment = createAsyncThunk<
  { issueId: string; comment: CommentInterface },
  PostCommentPayload,
  { state: RootState }
>(
  "issues/postComment",
  async ({ issueId, content }, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.user.meta.accessToken;

      const response = await axios.post(
        `http://localhost:4000/api/issues/${issueId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return { issueId, comment: response.data.comment };
    } catch (error: unknown) {
      // 1. Cast or check if the error is an official Axios instance error 👇
      const axiosError = error as AxiosError<BackendErrorResponse>;

      // 2. Extract the message cleanly without violating type checks
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Failed to post comment";

      return rejectWithValue(errorMessage);
    }
  },
);
