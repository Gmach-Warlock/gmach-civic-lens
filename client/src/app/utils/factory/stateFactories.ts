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
      zipCode: 0,
    },
    meta: {
      createdAt: "",
      lastLogin: "",
      isAdmin: false,
      accessToken: "",
      refreshToken: "",
    },
    comments: [],
  },
  activity: {
    requests: [],
    comments: [],
  },

  loadingState: createInitialLoadingState(),
});
