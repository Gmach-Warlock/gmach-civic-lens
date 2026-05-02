import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Title() {
  const scope = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // 1. Initial State
      gsap.set(".img--magnifying-glass", {
        display: "block",
        opacity: 0,
        x: -150,
        scale: 0.7,
        rotation: 0,
        zIndex: 10,
      });

      tl.current = gsap.timeline();

      tl.current
        // Entrance
        .to(".img--magnifying-glass", {
          opacity: 1,
          x: -60,
          duration: 0.5,
          ease: "power1.out",
        })
        // The Scan (linear y, linear x)
        .to(
          ".letter",
          {
            y: -20,
            scale: 1.3,
            duration: 0.4,
            stagger: { each: 0.1, yoyo: true, repeat: 1 },
            ease: "power2.inOut",
          },
          "scanStart",
        )
        .to(
          ".img--magnifying-glass",
          {
            x: () => {
              const lettersWidth =
                scope.current?.querySelector(".hero__letters")?.clientWidth ||
                0;
              return lettersWidth - 25;
            },
            scale: 1,
            duration: 1.5,
            ease: "none",
          },
          "scanStart",
        )

        .to(".img--magnifying-glass", {
          x: "+=40",
          rotation: 15,
          duration: 0.5,
          ease: "power2.out",
        })

        .to(".img--magnifying-glass", {
          x: () => {
            const lettersWidth =
              scope.current?.querySelector(".hero__letters")?.clientWidth || 0;
            return lettersWidth - 0;
          },
          rotation: -15,
          scale: 0.85,
          duration: 0.7,
          ease: "power2.inOut",
          onStart: () => {
            gsap.set(".img--magnifying-glass", { zIndex: 1 });
          },
        });
      /*         .to(
          ".reflection-streak",
          {
            left: "150%",
            duration: 0.7,
            ease: "power1.inOut",
          },
          "-=0.2",
        ); */
    },
    { scope },
  );

  /* const handleSkip = () => tl.current?.progress(1); */

  return (
    <div className="title__container" ref={scope}>
      <div className="title">
        {/*         <button type="button" className="btn btn--skip" onClick={handleSkip}>
          Skip
        </button> */}
        <div className="hero__letters">
          <span className="letter C">C</span>
          <span className="letter i1">i</span>
          <span className="letter v">v</span>
          <span className="letter i2">i</span>
          <span className="letter c">c</span>
          <span className="letter space">&nbsp;</span>
          <span className="letter L">L</span>
          <span className="letter e">e</span>
          <span className="letter n">n</span>
          <span className="letter s">s</span>
        </div>
        <div className="glass-wrapper">
          <div className="reflection-streak"></div>
          <img
            src="/magnifyingGlass.png"
            alt="magnifying glass"
            className="img img--magnifying-glass"
          />
        </div>
      </div>
    </div>
  );
}
