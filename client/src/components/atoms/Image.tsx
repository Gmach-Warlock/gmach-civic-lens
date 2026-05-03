import { useState, useRef, useLayoutEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";

export type StandardSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface ImageProps extends ComponentPropsWithoutRef<"img"> {
  size: StandardSize;
  measure?: boolean;
}

function Image({
  size,
  measure,
  className = "",
  alt,
  src,
  ...props
}: ImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const mergedClassName = `img img--${size} ${className}`.trim();

  useLayoutEffect(() => {
    if (measure && imgRef.current) {
      const { clientWidth, clientHeight } = imgRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
      console.log(`Image "${alt}" measured.`);
    }
  }, [measure, src, alt]);

  return (
    <div className="image-container">
      <img
        ref={imgRef}
        {...props}
        className={mergedClassName}
        src={src}
        alt={alt}
      />

      {measure && (
        <span className="image-badge">
          {dimensions.width} x {dimensions.height}
        </span>
      )}
    </div>
  );
}

export default Image;
