import type { RootState } from "../../../app/store/store";

export const selectIssues = (state: RootState) => state.issues.general.issues;
