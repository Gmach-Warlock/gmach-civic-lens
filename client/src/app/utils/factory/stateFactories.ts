import type {
  AuthStateInterface,
  BaseFetchStatusInterface,
} from "../../interfaces/authInterfaces";

export const createInitialLoadingState = (): BaseFetchStatusInterface => ({
  state: "loading",
  message: "",
});

export const createInitialUserState = (): AuthStateInterface => ({
  user: {
    general: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      address: "",
      city: "",
      zipCode: "",
    },
    meta: {
      id: "",
      createdAt: "",
      lastLogin: "",
      isAdmin: false,
      accessToken: "",
      refreshToken: "",
      theme: "dark",
    },
    comments: [],
  },
  activity: {
    requests: [],
    comments: [],
  },

  loadingState: createInitialLoadingState(),
});
