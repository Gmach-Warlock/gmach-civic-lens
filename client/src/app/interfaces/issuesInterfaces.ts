import type { LoadingStateType } from "../types/generalTypes";
import type {
  CategoryType,
  StatusType,
  UrgencyType,
} from "../types/issuesTypes";

export interface IssueInterface {
  meta: {
    id: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
  };
  general: {
    title: string;
    description: string;
    category: CategoryType;
  };
  location: {
    zip: number;
    address?: string;
    coords?: { lat: number; lng: number };
  };
  status: {
    current: StatusType;
    urgency: UrgencyType;
    lastActionDate: string;
  };
  social: {
    upvotes: number;
    tags: string[];
  };
}

export interface IssuesStateInterface {
  general: {
    issues: IssueInterface[];
    selectedIssueId: string | null;
    entities: { [id: string]: IssueInterface } | null;
    ids: string[];
  };
  meta: {
    accessToken: string;
    refreshToken: string;
    lastFetch: string;
  };
  state: {
    loading: boolean;
    loadingState: LoadingStateType;
    message: string | null;
  };
}
