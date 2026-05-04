import type { LoadingStateType } from "../types/usersTypes";

export interface UserActivityInterface {
  requests: UserRequestInterface[];
  comments: UserCommentInterface[];
}

export interface UserGeneralInfoInterface {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  address: string;
  zipCode: string;
}

export interface UserMetaInfoInterface {
  createdAt: string;
  lastLogin: string;
  isAdmin: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface UserRequestInterface {
  id: string;
  title: string;
  createdAt: string;
  description: string;
  location: string;
}

export interface UserCommentInterface {
  id: string;
  requestId: string;
  content: string;
  createdAt: string;
}

export interface UserInterface {
  general: UserGeneralInfoInterface;
  meta: UserMetaInfoInterface;
  comments: UserCommentInterface[];
}
export interface AuthStateInterface {
  user: UserInterface;
  activity: UserActivityInterface;
  loadingState: BaseFetchStatusInterface;
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
