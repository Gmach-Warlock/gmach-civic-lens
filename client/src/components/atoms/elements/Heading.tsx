import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";

export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingStyle = "basic" | "blocked" | "clipped" | "pill";
export type HeadingColor =
  | "primary"
  | "secondary"
  | "accent"
  | "background"
  | "neutral-light"
  | "neutral-dark"
  | "mono";

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  size: HeadingSize;
  headingStyle: HeadingStyle;
  color: HeadingColor;
}

export default function Heading({
  size,
  headingStyle,
  color,
  children,
  className = "",
  style,
  ...props
}: HeadingProps) {
  const Tag = `h${size}` as const;
  const theme = useAppSelector(selectTheme);

  // Surgical fix: Only add the theme modifier if NOT mono
  const themeClass =
    color !== "mono" ? `heading--${headingStyle}-${theme}` : "";

  const mergedClassName =
    `heading ${themeClass} heading--${headingStyle} heading--color-${color} ${className}`.trim();

  const hsMap: Record<HeadingColor, string> = {
    primary: "var(--primary-hs)",
    secondary: "var(--secondary-hs)",
    accent: "var(--accent-hs)",
    background: "var(--background-hs)",
    "neutral-light": "var(--neutral-hs)",
    "neutral-dark": "var(--neutral-hs)",
    mono: "var(--neutral-hs)", // Adjusted to a neutral hue
  };

  const mergedStyle: CSSProperties = {
    ...style,
    ["--current-hs" as string]: hsMap[color],
  };

  return (
    <Tag {...props} className={mergedClassName} style={mergedStyle}>
      {children || props.content}
    </Tag>
  );
}
