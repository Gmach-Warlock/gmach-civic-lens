import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingStyle = "basic" | "blocked" | "clipped" | "pill";
export type HeadingColor =
  | "primary"
  | "secondary"
  | "accent"
  | "background"
  | "neutral-light"
  | "neutral-dark";

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

  const mergedClassName =
    `heading heading--${headingStyle} heading--color-${color} ${className}`.trim();

  const hsMap: Record<HeadingColor, string> = {
    primary: "var(--primary-hs)",
    secondary: "var(--secondary-hs)",
    accent: "var(--accent-hs)",
    background: "var(--background-hs)",
    "neutral-light": "var(--neutral-hs)",
    "neutral-dark": "var(--neutral-hs)",
  };

  const mergedStyle: CSSProperties = {
    ...style,
    ["--current-hs" as string]: hsMap[color],
  };

  return (
    <>
      <Tag {...props} className={mergedClassName} style={mergedStyle}>
        {children || props.content}
      </Tag>
    </>
  );
}
