import type { ComponentPropsWithoutRef } from "react";
import type { FormType, InputType } from "../types/componentTypes";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  gridClass?: string;
  validate?: (value: string) => string;
}

export interface FormProps extends ComponentPropsWithoutRef<"form"> {
  formType: FormType;
  isRegistering: boolean;
  inputs?: InputObject[];
}

export interface GenericFormProps {
  fields: FieldConfig[];
  submitButtonText: string;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  title?: string;
  className?: string;
}

export interface InputObject {
  type: InputType;
  name: string;
}
