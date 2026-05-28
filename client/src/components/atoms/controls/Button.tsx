import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type {
  ButtonType,
  ButtonVariant,
} from "../../../app/types/componentTypes";
import type { GlobalThemeType } from "../../../app/types/globalTypes";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  type?: ButtonType;
  name: string;
  content?: string;
  children?: ReactNode; // Add this line
  variant?: ButtonVariant;
  theme?: GlobalThemeType;
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "submit",
      content,
      children,
      name,
      variant = "primary",
      className,
      ...props
    },
    ref,
  ) => {
    const theme = useAppSelector(selectTheme);

    return (
      <button
        ref={ref}
        type={type}
        className={`btn btn--${variant} btn--${theme} ${className ?? ""}`}
        title={name}
        id={props.id ?? name}
        {...props}
      >
        {children || content || "Submit"}
      </button>
    );
  },
);
export default Button;
