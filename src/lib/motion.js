import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const EASE = "expo.out";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * True once the intro curtain has lifted. The loader records completion on
 * window as well as firing an event, so components that mount late still see
 * it; a failsafe guarantees content is never held back indefinitely.
 */
export function useIntroComplete() {
  const [done, setDone] = useState(
    () => typeof window !== "undefined" && Boolean(window.__loadingComplete)
  );

  useEffect(() => {
    if (done) return;
    const finish = () => setDone(true);
    window.addEventListener("loadingComplete", finish);
    const failsafe = setTimeout(finish, 4000);
    return () => {
      window.removeEventListener("loadingComplete", finish);
      clearTimeout(failsafe);
    };
  }, [done]);

  return done;
}

/**
 * Fades and lifts every `selector` match inside `scopeRef` as it scrolls into
 * view. immediateRender: false keeps content visible until its trigger
 * actually fires, so nothing is stranded at opacity 0 if it never does.
 */
export function useReveal(scopeRef, selector = "[data-reveal]") {
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !scopeRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 1.2,
          ease: EASE,
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, selector]);
}

/** Pulls an element toward the cursor while hovered (fine pointers only). */
export function useMagnetic(ref, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, strength]);
}
