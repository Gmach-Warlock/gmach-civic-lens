import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { WrapperType } from "../../../app/types/componentTypes";

interface WrapperProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant?: WrapperType;
}

function Wrapper({
  children,
  variant = "xs",
  className = "",
  ...rest
}: WrapperProps) {
  return (
    <div
      className={`wrapper wrapper--${variant} mx-auto ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Wrapper;
