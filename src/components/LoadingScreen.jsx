import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../lib/motion";
import "./LoadingScreen.css";

const NAME = "Shivendra Shukla";
const VISIT_KEY = "portfolio-intro-seen-v2";
const markComplete = () => {
  window.__loadingComplete = true;
  window.dispatchEvent(new CustomEvent("loadingComplete"));
};

export default function LoadingScreen() {
  const root = useRef(null);
  const name = useRef(null);
  const [dismissed, setDismissed] = useState(false);

  useLayoutEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(VISIT_KEY) === "1"; } catch { /* Storage is optional. */ }
    if (prefersReducedMotion() || seen) {
      markComplete(); setDismissed(true);
      return;
    }

    let disposed = false;
    let ctx;
    // Match the same loaded typeface at both ends of the handoff. The intro
    // remains readable while fonts load, with a short fallback deadline.
    const deadline = new Promise((resolve) => setTimeout(resolve, 100));
    Promise.race([document.fonts?.ready ?? Promise.resolve(), deadline]).then(() => {
      if (disposed) return;
      const destination = document.querySelector("[data-intro-brand]");
      ctx = gsap.context(() => {
        const source = name.current.getBoundingClientRect();
        const target = destination?.getBoundingClientRect();
        if (destination) gsap.set(destination, { opacity: 0 });
        const finish = () => {
          if (destination) gsap.set(destination, { opacity: 1 });
          try { sessionStorage.setItem(VISIT_KEY, "1"); } catch { /* Storage is optional. */ }
          markComplete(); setDismissed(true);
        };
        const tl = gsap.timeline({ onComplete: finish });
        tl.fromTo(".intro__char", { y: 0, yPercent: 115, autoAlpha: 1 },
          { y: 0, yPercent: 0, duration: 0.3, stagger: 0.008, ease: "power3.out" })
          .to(".intro__meta", { opacity: 0, duration: 0.15 }, 0.3)
          .to(".intro__curtain", { yPercent: -100, duration: 0.55, ease: "power3.inOut", onStart: markComplete }, 0.35);
        if (target) {
          tl.to(name.current, {
            x: target.left - source.left, y: target.top - source.top,
            scaleX: target.width / source.width, scaleY: target.height / source.height,
            transformOrigin: "left top", duration: 0.55, ease: "power3.inOut",
          }, 0.35);
        } else tl.to(name.current, { opacity: 0, duration: 0.3 }, 0.4);
      }, root);
    });
    return () => { disposed = true; ctx?.revert(); };
  }, []);

  if (dismissed) return null;
  return (
    <div ref={root} className="intro intro--handoff" aria-hidden="true">
      <div className="intro__curtain" />
      <p className="intro__name" ref={name}>
        {Array.from(NAME).map((char, i) => <span className="intro__mask" key={i}>
          <span className="intro__char">{char === " " ? "\u00a0" : char}</span>
        </span>)}
      </p>
      <span className="intro__meta mono">Portfolio / {new Date().getFullYear()}</span>
    </div>
  );
}
