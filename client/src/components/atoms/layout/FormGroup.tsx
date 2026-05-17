import type { ReactNode } from "react";

interface FormGroupProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4; // Optional: Enforce explicit layout structures
}

export function FormGroup({
  children,
  className = "",
  columns = 2,
}: FormGroupProps) {
  // Dynamic BEM modifier class based on column count (e.g., form__group--cols-2)
  const layoutClass = `form__group-row form__group-row--cols-${columns}`;

  return <div className={`${layoutClass} ${className}`}>{children}</div>;
}
