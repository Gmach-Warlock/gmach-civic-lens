import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  AuthResponseInterface,
  UserGeneralInfoInterface,
} from "../../../app/interfaces/authInterfaces";

const registerUserUrl = `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_REGISTER_USER_PATH}`;

export const registerUser = createAsyncThunk<
  AuthResponseInterface, // 1. The return type of a successful fetch (e.g., AuthStateInterface)
  UserGeneralInfoInterface, // 2. The type of the argument passed into the thunk
  { rejectValue: string } // 3. The type of the error returned by rejectWithValue
>("user/createUser", async (user, thunkApi) => {
  try {
    console.log("Sending to:", registerUserUrl);

    const response = await fetch(registerUserUrl, {
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
});
