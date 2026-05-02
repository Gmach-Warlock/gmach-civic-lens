import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginFetchStateInterface } from "../../../app/interfaces/authInterfaces";

const loginUserUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_LOGIN_USER_PATH}`;

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userLoginInfo: LoginFetchStateInterface, thunkApi) => {
    try {
      console.log("Sending to:", loginUserUrl);

      const response = await fetch(loginUserUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLoginInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkApi.rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log("data is ", data);

      return data;
    } catch (err) {
      if (err instanceof Error) {
        return thunkApi.rejectWithValue(err.message);
      }
      return thunkApi.rejectWithValue("An unexpected error occurred");
    }
  },
);
