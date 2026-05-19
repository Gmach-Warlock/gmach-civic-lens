import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ColumnType } from "../../../app/types/componentTypes";
import type { NumberSizes } from "../../../app/types/globalTypes";

interface ColumnProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant?: ColumnType;
  gap?: NumberSizes;
}

function Column({
  children,
  variant = "centered",
  className = "",
  gap,
  ...rest
}: ColumnProps) {
  return (
    <div
      className={`column column--${variant} mx-auto gap-${gap} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Column;
