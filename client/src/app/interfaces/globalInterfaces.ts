import type { GlobalThemeType, GlobalToastType } from "../types/globalTypes";
import type { StatusType } from "../types/issuesTypes";

export interface ToastMessageInterface {
  id: string;
  message: string;
  type: GlobalToastType;
}

export interface GlobalStateInterface {
  theme: GlobalThemeType;
  isSideBarOpen: boolean;
  status: StatusType;
  toasts: ToastMessageInterface[];
}
