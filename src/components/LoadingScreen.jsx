import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

// The intro is a brand flourish, not a real loading bar. Paced to feel
// deliberate without becoming a tax on the first visit — roughly 1.5s on the
// counter, then a ~1.6s reveal.
const TICK_MS = 75;
const MAX_STEP = 9;
const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function LoadingScreen() {
  const [loading, setLoading] = useState(!PREFERS_REDUCED_MOTION);
  const [progress, setProgress] = useState(PREFERS_REDUCED_MOTION ? 100 : 0);
  const [dismissed, setDismissed] = useState(false);
  const comp = useRef(null);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.ceil(Math.random() * MAX_STEP), 100);
        if (next >= 100) {
          clearInterval(interval);
          setLoading(false);
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    const done = () => {
      // Record the state as well as firing the event: a listener that mounts
      // after this point would otherwise miss the signal entirely.
      window.__loadingComplete = true;
      window.dispatchEvent(new CustomEvent("loadingComplete"));
      setDismissed(true);
    };

    if (PREFERS_REDUCED_MOTION) {
      gsap.set([".loadingScreen", ".bar"], { opacity: 0, height: 0 });
      done();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    tl.to(".loadingScreen", { duration: 0.7, opacity: 0 }).to(
      ".bar",
      {
        duration: 0.9,
        height: 0,
        stagger: { amount: 0.5 },
        onComplete: done,
      },
      // Start the curtain lifting slightly before the counter has fully faded
      // so the two read as one continuous movement.
      "-=0.3"
    );

    return () => tl.kill();
  }, [loading]);

  // Unmount once finished so a full-viewport fixed overlay isn't left in the DOM.
  if (dismissed) return null;

  return (
    <div ref={comp} className="overlay-loading" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <div className="bar" key={i}></div>
      ))}
      <p className="loadingScreen">{progress}%</p>
    </div>
  );
}
