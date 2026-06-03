import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ImpulseLineProps {
  message: string;
  className?: string; // For layout tweaks (margins, alignment, etc.)
  animation?: gsap.TweenVars; // Optional GSAP vars to override default behavior
  stagger?: number;
  delay?: number;
}

export default function ImpulseLine({
  message,
  className = "",
  animation,
  stagger = 0.05,
  delay = 0,
}: ImpulseLineProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Default animation if none is provided
      const defaultAnim: gsap.TweenVars = {
        opacity: 0,
        y: 15,
        filter: "blur(4px)",
        ease: "power3.out",
        duration: 0.8,
      };

      gsap.from(".impulse-letter", {
        ...(animation || defaultAnim),
        stagger: stagger,
        delay: delay,
      });
    },
    { scope, dependencies: [animation, message] },
  );

  return (
    <div ref={scope} className={`impulse-line ${className}`}>
      {message.split("").map((char, index) => (
        <span key={index} className="impulse-letter">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
