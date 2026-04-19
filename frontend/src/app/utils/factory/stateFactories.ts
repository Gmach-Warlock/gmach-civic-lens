import type {
  BaseFetchStatusInterface,
  UserInterface,
} from "../../interfaces/userInterfaces";

export const createInitialLoadingState = (): BaseFetchStatusInterface => ({
  state: "loading",
  message: "",
});

export const createInitialUserState = (): UserInterface => ({
  user: {
    general: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      address: "",
    },
    meta: {
      createdAt: "",
      lastLogin: "",
      isAdmin: false,
      token: "",
    },
  },
  activity: {
    requests: [],
    comments: [],
  },

  loadingState: createInitialLoadingState(),
});
