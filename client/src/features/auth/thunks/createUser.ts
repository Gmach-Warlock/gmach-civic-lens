import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UserInterface } from "../../../app/interfaces/authInterfaces";

const createUserUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_CREATE_USER_PATH}`;

export const createUser = createAsyncThunk(
  "user/createUser",
  async (user: UserInterface, thunkApi) => {
    try {
      console.log("Sending to:", createUserUrl);

      const response = await fetch(createUserUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
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
