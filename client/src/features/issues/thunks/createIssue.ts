import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../auth/selectors/authSelectors";
import type { IssueInterface } from "../../../app/interfaces/issuesInterfaces";

export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (issue: IssueInterface, thunkApi) => {
    try {
      const createIssueUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_CREATE_ISSUE_PATH}`;

      const accessToken = useAppSelector(selectAccessToken);
      // 2. Axios Request
      const response = await axios.post(createIssueUrl, issue, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Success:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error))
        return thunkApi.rejectWithValue(error.response?.data || "Server Error");
    }
  },
);
