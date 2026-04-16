export interface UserRequest {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  createdAt: Date;
  description: string;
}

export interface UserComment {
  id: string;
  requestId: string; // The ID of the post they commented on
  content: string;
  createdAt: Date;
}

export interface UserInterface {
  // Primary account details
  general: {
    fullName: string;
    username: string;
    email: string;
    password?: string;
    avatarUrl?: string; // Helpful for civic sites to build trust
  };

  // Tracking history and site engagement
  activity: {
    requests: UserRequest[];
    comments: UserComment[];
  };

  // Database/System-level timestamps
  meta: {
    createdAt: Date;
    lastLogin: Date;
    isAdmin: boolean;
  };
}

export interface BaseFetchStatus {
  loading: boolean;
  isSuccess: boolean;
  error: string | null;
  isIdle: boolean;
}

// 1. Descriptive User Fetch Interface
export interface FetchUsersInterface extends BaseFetchStatus {
  users: {
    registrationSuccess: boolean; // Specific to your "forced login" flow
    lastFetchedUser?: string; // To track who was just looked up
  };
}

// 2. Descriptive Issue Fetch Interface
export interface FetchIssueInterface extends BaseFetchStatus {
  issues: {
    isUploadingImage: boolean; // Specific to civic reporting (e.g., photo of a pothole)
    totalResultsFound: number; // For your list view pagination
  };
}
