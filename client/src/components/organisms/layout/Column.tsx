import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ColumnType } from "../../../app/types/componentTypes";

interface ColumnProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant?: ColumnType;
}

function Column({
  children,
  variant = "centered",
  className = "",
  ...rest
}: ColumnProps) {
  return (
    <div
      className={`column column--${variant} mx-auto ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Column;
