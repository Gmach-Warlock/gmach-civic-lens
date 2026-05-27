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
  const gapClass = gap !== undefined ? `gap-${gap}` : "gap-none";
  return (
    <div
      className={`row row--${variant} my-auto ${gapClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Row;
