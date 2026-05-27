import type { LoadingState } from "../types/globalTypes";
import type {
  CategoryType,
  StatusType,
  UrgencyType,
} from "../types/issuesTypes";

export interface CommentInterface {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface CreateIssueRequestInterface {
  title: string;
  description: string;
  category: CategoryType;

  // Optional geolocation tracking properties
  lat?: number | null;
  lng?: number | null;
  crossStreets?: string | null;
}

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
    crossStreets?: string;
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
    comments: CommentInterface[];
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
