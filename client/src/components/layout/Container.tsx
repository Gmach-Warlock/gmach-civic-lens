import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant?: "narrow" | "wide" | "fluid";
}

function Container({
  children,
  variant = "wide",
  className = "",
  ...rest
}: ContainerProps) {
  const maxWidthClass = variant === "narrow" ? "max-w-2xl" : "max-w-6xl";

  return (
    <div
      className={`container ${maxWidthClass} mx-auto ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Container;
