import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hasFinePointer } from "../lib/motion";

// How far the ripple spreads to neighbouring letters, and how strongly.
const FALLOFF = [1, 0.55, 0.25];
const HOT_MS = 650;

const rand = (n) => gsap.utils.random(-n, n);

/**
 * Splits text into letters that jitter and flash the accent colour when the
 * cursor passes over them. The touched letter reacts fully and its
 * neighbours ripple with less force, then everything springs back.
 *
 * Screen readers get the plain text; the per-letter spans are hidden from them.
 */
export default function HoverText({ text, className = "" }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    // Kept under reduced motion: it is small, brief and only runs when the
    // visitor points at a letter, which is not the large movement that
    // setting exists to stop.
    if (!el || !hasFinePointer()) return;

    const chars = Array.from(el.querySelectorAll(".ht__char"));
    const timers = new Map();

    const kick = (char, force) => {
      gsap.killTweensOf(char);
      gsap
        .timeline()
        .to(char, {
          x: () => rand(0.06 * force) + "em",
          y: () => rand(0.08 * force) - 0.12 * force + "em",
          rotation: () => rand(14 * force),
          duration: 0.05,
          repeat: 3,
          yoyo: true,
          repeatRefresh: true,
          ease: "none",
        })
        .to(char, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.35)",
        });

      char.classList.add("is-hot");
      clearTimeout(timers.get(char));
      timers.set(char, setTimeout(() => char.classList.remove("is-hot"), HOT_MS * force));
    };

    const onOver = (e) => {
      const char = e.target.closest?.(".ht__char");
      if (!char) return;
      const i = chars.indexOf(char);
      FALLOFF.forEach((force, d) => {
        if (d === 0) return kick(char, force);
        if (chars[i - d]) kick(chars[i - d], force);
        if (chars[i + d]) kick(chars[i + d], force);
      });
    };

    el.addEventListener("pointerover", onOver);
    return () => {
      el.removeEventListener("pointerover", onOver);
      timers.forEach(clearTimeout);
      gsap.killTweensOf(chars);
    };
  }, [text]);

  return (
    <span ref={root} className={`ht ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((word, w) =>
          /^\s+$/.test(word) ? (
            " "
          ) : (
            // Words stay unbroken so per-letter spans can't wrap mid-word.
            <span className="ht__word" key={w}>
              {Array.from(word).map((ch, c) => (
                <span className="ht__char" key={c}>
                  {ch}
                </span>
              ))}
            </span>
          )
        )}
      </span>
    </span>
  );
}
