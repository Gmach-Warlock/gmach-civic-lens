import type { LoadingState } from "../types/globalTypes";
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
    address?: string;
    city: string;
    zipCode: string;
    crossStreets: string;
    coords?: { lat: number; lng: number };
  };
  status: {
    isOpen: boolean;
    current: StatusType;
    urgency: UrgencyType;
    lastActionDate: string;
  };
  social: {
    upvotes: number;
    tags: string[];
    comments: {
      id: string;
      authorId: string;
      authorName: string;
      content: string;
      createdAt: string;
    }[];
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
    loadingState: LoadingState;
    message: string | null;
  };
}
