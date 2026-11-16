import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./ElasticName.css";

export default function ElasticName({ text }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const el = root.current;
      const chars = Array.from(el.children);
      const moves = chars.map((char) => ({
        stretch: gsap.quickTo(char, "scaleY", { duration: 0.45, ease: "power3.out" }),
        lift: gsap.quickTo(char, "y", { duration: 0.45, ease: "power3.out" }),
        tint: gsap.quickTo(char, "--ink", { duration: 0.3, ease: "power2.out" }),
      }));
      let frame = 0;
      let pointerX = 0;
      const update = () => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const x = pointerX - rect.left;
        const radius = rect.width * 0.22;
        chars.forEach((char, i) => {
          // Offset positions stay stable while the glyph itself stretches.
          const center = char.offsetLeft + char.offsetWidth / 2;
          const force = Math.max(0, 1 - Math.abs(center - x) / radius);
          const eased = force * force;
          moves[i].stretch(1 + eased * 0.24);
          moves[i].lift(-eased * Math.min(12, rect.height * 0.05));
          moves[i].tint(eased * 100);
        });
      };
      const move = (event) => {
        pointerX = event.clientX;
        if (!frame) frame = requestAnimationFrame(update);
      };
      const reset = () => {
        cancelAnimationFrame(frame); frame = 0;
        moves.forEach(({ stretch, lift, tint }) => { stretch(1); lift(0); tint(0); });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);
      return () => {
        cancelAnimationFrame(frame);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
        window.removeEventListener("blur", reset);
      };
    }, root);
    return () => media.revert();
  }, [text]);

  return <span className="elastic-name" ref={root} aria-hidden="true">
    {Array.from(text).map((char, i) => <span className="elastic-name__char" key={i}>{char}</span>)}
  </span>;
}
