import { type ComponentPropsWithoutRef } from "react";
import type { IconSize, IconVariant } from "../../../app/types/componentTypes";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";

interface IconProps extends ComponentPropsWithoutRef<"span"> {
  name: string; // e.g., "gear", "user", "magnifying-glass"
  variant?: IconVariant;
  size?: IconSize;
}

function Icon({ name, variant, size, className = "", ...props }: IconProps) {
  const theme = useAppSelector(selectTheme);

  // 1. Resolve Font Awesome variant prefixes
  const resolvedVariant = variant || (theme === "light" ? "regular" : "solid");

  const prefixMap: Record<IconVariant, string> = {
    solid: "fa-solid",
    regular: "fa-regular",
    light: "fa-light",
    thin: "fa-thin",
    brand: "fa-brands",
  };

  const variantClass = prefixMap[resolvedVariant];
  const nameClass = `fa-${name}`;

  // 2. Size scale modifier
  const sizeClass = size ? `icon--${size}` : "";

  return (
    <span
      className={`icon-wrapper icon--${theme} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      <i className={`${variantClass} ${nameClass}`.trim()} aria-hidden="true" />
    </span>
  );
}

export default Icon;
