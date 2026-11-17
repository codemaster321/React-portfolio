import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

const ITEMS = [
  "Agentic workflows",
  "RAG pipelines",
  "Full-stack products",
  "LLM integrations",
  "Subscription apps",
  "Developer tooling",
];

const LOOP_SECONDS = 38;

/**
 * Infinite strip driven by one GSAP tween rather than a CSS animation, so it
 * can be slowed, stopped and reversed without losing its place:
 * - hovering eases it to a stop where it is, leaving eases it back up;
 * - scrolling speeds it up, and scrolling up runs it backwards.
 *
 * The track holds the list twice and slides by exactly half its width, so the
 * loop seam is invisible. The second copy is hidden from assistive tech.
 */
export default function Marquee() {
  const trackRef = useRef(null);
  const loop = useRef(null);
  const hovering = useRef(false);
  const direction = useRef(1);
  const visible = useRef(false);
  const speedTo = useRef(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
    const track = trackRef.current;
    const tween = gsap.fromTo(
      trackRef.current,
      { xPercent: 0 },
      { xPercent: -50, duration: LOOP_SECONDS, ease: "none", repeat: -1 }
    );
    // Start deep into the repeats so running it backwards (scrolling up)
    // never reaches time zero and stalls.
    tween.totalTime(LOOP_SECONDS * 1000);
    tween.pause();
    loop.current = tween;
    speedTo.current = gsap.quickTo(tween, "timeScale", { duration: 0.5, ease: "power2.out" });
    const sync = () => tween.paused(!visible.current || document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      sync();
    });
    observer.observe(track.parentElement);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      speedTo.current?.tween.kill();
      speedTo.current = null;
      loop.current = null;
      visible.current = false;
      tween.kill();
    };
    }, trackRef);
    return () => media.revert();
  }, []);

  const setSpeed = (speed) => {
    speedTo.current?.(speed);
  };

  // Scroll velocity briefly boosts the speed; the sign sets the direction.
  useLenis(({ velocity }) => {
    if (!visible.current || document.hidden || hovering.current || !loop.current) return;
    if (Math.abs(velocity) > 0.5) direction.current = Math.sign(velocity);
    const boost = Math.min(Math.abs(velocity) / 6, 4);
    setSpeed(direction.current * (1 + boost), 0.4);
  });

  const renderItems = (hidden) =>
    ITEMS.map((item) => (
      <span className="marquee__item" key={item} aria-hidden={hidden || undefined}>
        {item}
        <span className="marquee__star" aria-hidden="true">✳</span>
      </span>
    ));

  return (
    <div
      className="marquee"
      onPointerEnter={() => {
        hovering.current = true;
        setSpeed(0, 0.8);
      }}
      onPointerLeave={() => {
        hovering.current = false;
        setSpeed(direction.current, 0.8);
      }}
    >
      <div className="marquee__track" ref={trackRef}>
        {renderItems(false)}
        {renderItems(true)}
      </div>
    </div>
  );
}
