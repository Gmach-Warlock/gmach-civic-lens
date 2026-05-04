import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { RowType } from "../../../app/types/componentTypes";

interface RowProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant?: RowType;
}

function Row({
  children,
  variant = "centered",
  className = "",
  ...rest
}: RowProps) {
  return (
    <div
      className={`row row--${variant} my-auto ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Row;
