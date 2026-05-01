import { createSlice } from "@reduxjs/toolkit";

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
    category: "infrastructure" | "safety" | "sanitation" | "other";
  };
  location: {
    zip: number;
    address?: string;
    coords?: { lat: number; lng: number };
  };
  status: {
    current: "tbd" | "active" | "finished" | "reoccurring" | "waiting";
    urgency: "low" | "medium" | "high";
    lastActionDate: string;
  };
  social: {
    upvotes: number;
    tags: string[];
  };
}

export interface IssuesState {
  items: IssueInterface[];
  loading: boolean;
  error: string | null;
  selectedIssueId: string | null;
  entities: { [id: string]: IssueInterface };
  ids: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

export interface IssuesInterface {
  issues: IssueInterface[];
}

const initialIssuesState = {};

const issuesSlice = createSlice({
  name: "issues",
  initialState: initialIssuesState,
  reducers: {
    getAllIssue: () => {},
  },
});

export default issuesSlice.reducer;
