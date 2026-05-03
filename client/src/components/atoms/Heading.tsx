export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingStyle = "basic" | "blocked" | "clipped";
export type HeadingColor =
  | "primary"
  | "secondary"
  | "accent"
  | "background"
  | "neutral-light"
  | "neutral-dark";
export interface HeadingProps {
  size: HeadingSize;
  style: HeadingStyle;
  color: HeadingColor;
  content: string;
}

export default function Heading({ size, style, color, content }: HeadingProps) {
  const tags = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6",
  } as const;

  const Tag = tags[size];
  const className = `heading heading--${style} heading--color-${color}`;

  const hsMap: Record<HeadingColor, string> = {
    primary: "var(--primary-hs)",
    secondary: "var(--secondary-hs)",
    accent: "var(--accent-hs)",
    background: "var(--background-hs)",
    "neutral-light": "var(--neutral-hs)",
    "neutral-dark": "var(--neutral-hs)", // Added missing ")" here
  };

  return (
    <Tag
      className={className}
      style={{ "--current-hs": hsMap[color] } as React.CSSProperties}
    >
      {content}
    </Tag>
  );
}
