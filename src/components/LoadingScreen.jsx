import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../lib/motion";

const NAME = "Shivendra Shukla";

const markComplete = () => {
  // Record the state as well as firing the event: a listener that mounts
  // after this point would otherwise miss the signal entirely.
  window.__loadingComplete = true;
  window.dispatchEvent(new CustomEvent("loadingComplete"));
};

/**
 * A short branded intro: the name rises letter by letter, then the curtain
 * lifts. Kept under ~1.6s so it reads as a flourish, not a wait.
 */
export default function LoadingScreen() {
  const root = useRef(null);
  const [dismissed, setDismissed] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      markComplete();
      setDismissed(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => setDismissed(true),
      });

      tl.from(".intro__char", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.025,
      })
        .to(".intro__char", {
          yPercent: -110,
          duration: 0.6,
          stagger: 0.015,
          ease: "expo.in",
        }, "+=0.15")
        .to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "expo.inOut",
          // Let the hero start its own entrance as the curtain clears.
          onStart: () => setTimeout(markComplete, 250),
        }, "-=0.2");
    }, root);

    return () => ctx.revert();
  }, []);

  if (dismissed) return null;

  return (
    <div ref={root} className="intro" aria-hidden="true">
      <p className="intro__name">
        {NAME.split("").map((ch, i) => (
          <span className="intro__mask" key={i}>
            <span className="intro__char">{ch === " " ? " " : ch}</span>
          </span>
        ))}
      </p>
      <span className="intro__meta mono">Portfolio — ©{new Date().getFullYear()}</span>
    </div>
  );
}
