import type {
  BaseFetchStatusInterface,
  UserInterface,
} from "../../interfaces/userInterfaces";

export const createInitialLoadingState = (): BaseFetchStatusInterface => ({
  state: "loading",
  message: "",
});

export const createInitialUsersState = (): UserInterface => ({
  general: {
    fullname: "",
    username: "",
    email: "",
  },
  activity: {
    requests: [],
    comments: [],
  },
  meta: {
    createdAt: "",
    lastLogin: "",
    isAdmin: false,
  },
  loadingState: createInitialLoadingState(),
});
