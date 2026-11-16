import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ReadingProgress() {
  const bar = useRef(null);

  useLayoutEffect(() => {
    let lastPercent = -1;
    const ctx = gsap.context(() => {
      gsap.fromTo(bar.current, { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: true,
          // Measure after sections that add pin spacing to the document.
          refreshPriority: -1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const percent = Math.round(progress * 100);
            if (percent === lastPercent) return;
            lastPercent = percent;
            bar.current?.setAttribute("aria-valuenow", String(percent));
          },
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={bar}
      className="reading-progress"
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    />
  );
}
