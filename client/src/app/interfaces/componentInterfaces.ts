import type { ComponentPropsWithoutRef } from "react";
import type { FormType, InputType } from "../types/componentTypes";

export interface FormProps extends ComponentPropsWithoutRef<"form"> {
  formType: FormType;
  isRegistering: boolean;
  inputs?: InputObject[];
}

export interface InputObject {
  type: InputType;
  name: string;
}
