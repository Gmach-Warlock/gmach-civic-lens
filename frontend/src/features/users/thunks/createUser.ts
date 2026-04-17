import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UserInterface } from "../../../app/interfaces/userInterfaces";

const createUserUrl = import.meta.env.VITE_API_URL;

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: UserInterface, thunkApi) => {
    try {
      console.log(createUserUrl);
      const newUser = user;
      const response = await fetch(createUserUrl, {
        method: "post",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkApi.rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  },
);
