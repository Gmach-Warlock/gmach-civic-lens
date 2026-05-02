import type {
  BaseFetchStatusInterface,
  FetchIssueInterface,
} from "../../app/interfaces/authInterfaces";

// ✅ Correct: The variable is a function that RETURNS a BaseFetchStatus
const createInitialLoadingState = (): BaseFetchStatusInterface => ({
  state: "loading",
  message: "",
});

export const initialIssueState: FetchIssueInterface = {
  ...createInitialLoadingState(),
  issues: {
    isUploadingImage: false,
    totalResultsFound: 0,
  },
};
