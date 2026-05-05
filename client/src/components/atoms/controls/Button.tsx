import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type {
  ButtonType,
  ButtonVariant,
} from "../../../app/types/componentTypes";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  type?: ButtonType;
  name: string;
  content?: string;
  variant?: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "submit",
      content,
      name,
      variant = "primary",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`btn btn--${variant} ${className ?? ""}`}
        title={name}
        id={props.id ?? name}
        {...props}
      >
        {content || "Submit"}
      </button>
    );
  },
);
export default Button;
