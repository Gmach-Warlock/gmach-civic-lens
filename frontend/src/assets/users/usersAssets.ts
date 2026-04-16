import type { FetchIssueInterface } from "../../app/interfaces/userInterfaces";

const createInitialFetch = () => ({
  loading: false,
  isSuccess: false,
  error: null,
});

// Use it like this:
export const initialIssueState: FetchIssueInterface = {
  ...createInitialFetch(),
  isUploadingImage: false,
  totalResultsFound: 0,
  isIdle: true,
};
