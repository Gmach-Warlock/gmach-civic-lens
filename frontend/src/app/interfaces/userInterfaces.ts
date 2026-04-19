import type { LoadingStateType } from "../types/usersTypes";

export interface UserActivityInterface {
  requests: UserRequestInterface[];
  comments: UserCommentInterface[];
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserGeneralInfoInterface {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  address: string;
}

export interface UserMetaInfoInterface {
  createdAt: string;
  lastLogin: string;
  isAdmin: boolean;
  token: string;
}

export interface UserRequestInterface {
  id: string;
  title: string;
  status: LoadingStateType;
  createdAt: Date;
  description: string;
}

export interface UserCommentInterface {
  id: string;
  requestId: string;
  content: string;
  createdAt: Date;
}

export interface UserInterface {
  user: {
    general: UserGeneralInfoInterface;
    meta: UserMetaInfoInterface;
  };
  activity: UserActivityInterface;
  loadingState: BaseFetchStatusInterface;
}
export interface UserState {
  user: UserData | null; // This is where the nesting happens!
  loadingState: BaseFetchStatusInterface;
  activity: UserActivityInterface;
  token: string | null;
}

export interface LoginFetchStateInterface {
  username: string;
  password: string;
}

export interface BaseFetchStatusInterface {
  state: LoadingStateType;
  message: string;
}

export interface FetchUsersInterface extends BaseFetchStatusInterface {
  users: {
    registrationSuccess: boolean;
    lastFetchedUser?: string;
  };
}

export interface FetchIssueInterface extends BaseFetchStatusInterface {
  issues: {
    isUploadingImage: boolean;
    totalResultsFound: number;
  };
}

export interface FetchResourceInterface<T> extends BaseFetchStatusInterface {
  data: T | null;
}
