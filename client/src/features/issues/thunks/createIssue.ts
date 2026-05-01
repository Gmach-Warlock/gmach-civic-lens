import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../auth/selectors/authSelectors";

export const createIssue = createAsyncThunk("issues/createIssue", async () => {
  try {
    const createIssueUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_CREATE_ISSUE_PATH}`;
    const accessToken = useAppSelector(selectAccessToken);

    const response = await axios(createIssueUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
});
