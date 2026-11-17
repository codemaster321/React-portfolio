import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "./ProjectMotion.css";

gsap.registerPlugin(DrawSVGPlugin);

// Compact visual signatures. Only the artwork animates; card layout and
// stack transforms remain owned by Portfolio's scroll/Flip transitions.
export default function ProjectMotion({ id }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const button = el.closest("button");
    const media = gsap.matchMedia();
    media.add({
      reduce: "(prefers-reduced-motion: reduce)",
      fine: "(hover: hover) and (pointer: fine)",
    }, ({ conditions }) => {
      if (conditions.reduce) return;
      const tl = gsap.timeline({ paused: true });
      if (id === "modelhub") {
        tl.fromTo(".project-motion__node", { scale: .55, opacity: .25 },
          { scale: 1, opacity: 1, duration: .3, stagger: .06, ease: "back.out(1.6)", transformOrigin: "center" })
          .fromTo(".project-motion__draw", { drawSVG: "0%" },
            { drawSVG: "100%", stagger: .1, duration: .45, ease: "power2.inOut" }, .15)
          .fromTo(".project-motion__core", { scale: .8 },
            { scale: 1, duration: .45, ease: "elastic.out(1,.5)", transformOrigin: "center" }, .5);
      } else if (id === "sleeplog") {
        tl.fromTo(".project-motion__draw", { drawSVG: "0%" },
          { drawSVG: "100%", duration: .85, ease: "power2.inOut" })
          .fromTo(".project-motion__node", { scale: .4, opacity: 0 },
            { scale: 1, opacity: 1, duration: .3, stagger: .08, transformOrigin: "center", ease: "back.out(2)" }, .3);
      } else if (id === "procurement") {
        tl.fromTo(".project-motion__paper", { x: -12, y: 5, rotation: -8, opacity: .2 },
          { x: 0, y: 0, rotation: 0, opacity: 1, stagger: .09, duration: .5, ease: "power3.out", transformOrigin: "center" })
          .fromTo(".project-motion__draw", { drawSVG: "0%" },
            { drawSVG: "100%", stagger: .06, duration: .4, ease: "power2.out" }, .35);
      } else {
        tl.fromTo(".project-motion__arch", { scaleY: .7, opacity: .2 },
          { scaleY: 1, opacity: 1, duration: .6, stagger: .1, transformOrigin: "center bottom", ease: "power3.out" })
          .fromTo(".project-motion__draw", { drawSVG: "0%" },
            { drawSVG: "100%", duration: .55, ease: "power2.inOut" }, .2);
      }
      const play = () => tl.timeScale(1).restart();
      if (conditions.fine) {
        // Resting artwork stays complete. Each deliberate hover/focus replays
        // once, with no perpetual animation or per-frame React updates.
        tl.progress(1).pause();
        button.addEventListener("pointerenter", play);
        button.addEventListener("focus", play);
        return () => {
          button.removeEventListener("pointerenter", play);
          button.removeEventListener("focus", play);
        };
      }
      if (typeof IntersectionObserver === "undefined") { tl.progress(1).pause(); return; }
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        play(); observer.disconnect();
      }, { threshold: .5 });
      observer.observe(el);
      return () => observer.disconnect();
    }, root);
    return () => media.revert();
  }, [id]);

  return <span className={`project-motion project-motion--${id}`} ref={root} aria-hidden="true">
    <svg viewBox="0 0 160 52" width="160" height="52" fill="none" focusable="false">
      {id === "modelhub" && <>
        <path className="project-motion__draw" d="M22 26 H65 M78 26 L115 10 H139 M78 26 H139 M78 26 L115 42 H139" />
        <circle className="project-motion__node" cx="18" cy="26" r="5" />
        <circle className="project-motion__core" cx="75" cy="26" r="10" />
        {[10, 26, 42].map((y) => <circle className="project-motion__node" key={y} cx="144" cy={y} r="4" />)}
      </>}
      {id === "sleeplog" && <>
        <path className="project-motion__guide" d="M8 43 H152 M8 26 H152 M8 9 H152" />
        <path className="project-motion__draw" d="M8 38 C19 38 22 16 34 16 S48 33 60 33 S75 9 88 9 S105 24 118 24 S138 13 152 13" />
        {[[34,16],[88,9],[152,13]].map(([x,y]) => <circle className="project-motion__node" key={x} cx={x} cy={y} r="3" />)}
      </>}
      {id === "procurement" && <>
        <rect className="project-motion__paper" x="24" y="6" width="29" height="36" rx="3" />
        <rect className="project-motion__paper" x="40" y="9" width="29" height="36" rx="3" />
        <rect className="project-motion__paper" x="56" y="12" width="29" height="36" rx="3" />
        <path className="project-motion__draw" d="M63 22 H77 M63 28 H77 M63 34 H72 M97 29 H119 M114 24 L119 29 L114 34 M131 29 L137 35 L149 21" />
      </>}
      {id === "charvaka" && <>
        {[24, 63, 102].map((x) => <path key={x} className="project-motion__arch" d={`M${x} 45 V24 a15 15 0 0 1 30 0 V45 Z`} />)}
        <path className="project-motion__draw" d="M10 45 H150" />
      </>}
    </svg>
  </span>;
}
