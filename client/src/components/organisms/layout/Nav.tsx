import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { RowType } from "../../../app/types/componentTypes"; // Or wherever your alignment types sit

interface NavProps extends ComponentPropsWithoutRef<"nav"> {
  children: ReactNode;
  variant?: RowType; // Reusing your RowType variant for alignment if needed
}

function Nav({
  children,
  variant = "centered",
  className = "",
  ...rest
}: NavProps) {
  return (
    <nav className={`nav nav--${variant} ${className}`.trim()} {...rest}>
      {children}
    </nav>
  );
}

export default Nav;
