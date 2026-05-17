import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type {
  ButtonType,
  ButtonVariant,
} from "../../../app/types/componentTypes";
import type { GlobalThemeType } from "../../../features/global/globalSlice";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  type?: ButtonType;
  name: string;
  content?: string;
  variant?: ButtonVariant;
  theme?: GlobalThemeType;
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
        {content || "Submit"}
      </button>
    );
  },
);
export default Button;
