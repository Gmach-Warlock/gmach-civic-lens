import type { LoadingStateType } from "../types/usersTypes";

export interface UserActivityInterface {
  requests: UserRequestInterface[];
  comments: UserCommentInterface[];
}

export interface UserGeneralInfoInterface {
  fullname: string;
  username: string;
  email: string;
  password?: string;
}

export interface UserMetaInfoInterface {
  createdAt: string;
  lastLogin: string;
  isAdmin: boolean;
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
  general: UserGeneralInfoInterface;
  activity: UserActivityInterface;
  loadingState: BaseFetchStatusInterface;
  meta: UserMetaInfoInterface;
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
