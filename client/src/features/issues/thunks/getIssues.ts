import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../auth/selectors/authSelectors";

export const getIssues = createAsyncThunk("issues/getIssues", async () => {
  try {
    const getIssuesUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_GET_ALL_ISSUES_PATH}`;
    const accessToken = useAppSelector(selectAccessToken);

    const response = await axios(getIssuesUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
});
