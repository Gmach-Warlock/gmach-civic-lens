import { type ComponentPropsWithoutRef } from "react";
import type { IconSize, IconVariant } from "../../../app/types/componentTypes";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";

interface IconProps extends ComponentPropsWithoutRef<"i"> {
  name: string; // e.g., "gear", "user", "magnifying-glass"
  variant?: IconVariant; // Optional explicit override
  size?: IconSize; // Optional size mapping
}

function Icon({ name, variant, size, className = "", ...props }: IconProps) {
  const theme = useAppSelector(selectTheme);

  // 1. Resolve Font Awesome variant prefixes
  // If no variant is passed, it falls back to your theme logic (light = regular, dark = solid)
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

  // 2. Handle size modifier if provided (maps to your custom CSS sizing scale)
  const sizeClass = size ? `icon--${size}` : "";

  return (
    <i
      className={`${variantClass} ${nameClass} ${sizeClass} ${className}`.trim()}
      aria-hidden="true" // Good practice for pure decorational icons
      {...props}
    />
  );
}

export default Icon;
