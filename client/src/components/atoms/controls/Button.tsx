import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type {
  ButtonType,
  ButtonVariant,
} from "../../../app/types/componentTypes";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  type?: ButtonType;
  name: string;
  content?: string;
  variant?: ButtonVariant;
  authProperties?: {
    hasToken: boolean;
    isRegistering: boolean;
  };
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "submit",
      content,
      name,
      variant = "primary",
      className,
      authProperties,
      ...props
    },
    ref,
  ) => {
    const accessToken = useAppSelector(selectAccessToken);
    const getButtonText = () => {
      if (variant === "auth" && authProperties) {
        const authMap = {
          logout: "Logout",
          register: "Create Account",
          login: "Login",
        };

        if (accessToken) return authMap.logout;
        if (authProperties.isRegistering) return authMap.register;
        return authMap.login;
      }

      return content || "Submit";
    };

    const finalContent = getButtonText();

    return (
      <button
        ref={ref}
        type={type}
        className={`btn btn--${variant} ${className ?? ""}`}
        title={name}
        id={props.id ?? name}
        {...props}
      >
        {finalContent}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
