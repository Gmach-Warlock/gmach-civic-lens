import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { RowType } from "../../../app/types/componentTypes";
import type { NumberSizes } from "../../../app/types/globalTypes";

interface RowProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant?: RowType;
  gap?: NumberSizes;
}

function Row({
  children,
  variant = "centered",
  className = "",
  gap,
  ...rest
}: RowProps) {
  return (
    <div
      className={`row row--${variant} my-auto gap-${gap} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Row;
