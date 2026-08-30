import { useEffect } from "react";
import ReactLenis, { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// `smooth` and `smoothTouch` were Lenis v0 options and are ignored by v1.
// Touch is deliberately left on native scrolling — syncTouch feels laggy on
// mobile and native momentum is already good.
const lenisOptions = {
  lerp: 0.1,
  smoothWheel: true,
};

/**
 * Lenis drives scrolling on its own rAF loop, so ScrollTrigger never sees the
 * position change and scroll-triggered animations never fire. Forwarding
 * Lenis's scroll events into ScrollTrigger.update() keeps the two in sync.
 */
function ScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    ScrollTrigger.refresh();

    return () => lenis.off("scroll", update);
  }, [lenis]);

  return null;
}

function SmoothScrolling({ children }) {
  return (
    <ReactLenis root options={lenisOptions}>
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
