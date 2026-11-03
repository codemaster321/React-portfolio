import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import useSectionScroll from "../hooks/useSectionScroll";

const NAV_ITEMS = [
  { label: "Work", target: "#work" },
  { label: "About", target: "#about" },
  { label: "Experience", target: "#experience" },
  { label: "Contact", target: "#contact" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const scrollToSection = useSectionScroll(0);

  // Hide on the way down, return on the way up — the content gets the screen,
  // the nav is one flick away.
  const lenis = useLenis(({ scroll }) => {
    const delta = scroll - lastScroll.current;
    if (Math.abs(delta) > 6) setHidden(delta > 0 && scroll > 160);
    lastScroll.current = scroll;
  });

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const onKeyDown = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, lenis]);

  const go = (target) => {
    setIsOpen(false);
    scrollToSection(target);
  };

  return (
    <>
      <header
        className={`nav${hidden && !isOpen ? " nav--hidden" : ""}`}
      >
        <button type="button" className="nav__brand" onClick={() => go("#top")}>
          Shivendra Shukla<span className="nav__brand-mark">©</span>
        </button>

        <nav className="nav__links" aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, target }, i) => (
            <button
              type="button"
              key={label}
              className="nav__link"
              onClick={() => go(target)}
            >
              <span className="nav__link-label" data-text={label}>{label}</span>
              <sup className="mono">0{i + 1}</sup>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="nav__toggle mono"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`menu${isOpen ? " menu--open" : ""}`}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ label, target }, i) => (
            <button
              type="button"
              key={label}
              className="menu__link"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => go(target)}
              style={{ transitionDelay: isOpen ? `${0.08 * i + 0.15}s` : "0s" }}
            >
              <span className="mono">0{i + 1}</span>
              {label}
            </button>
          ))}
        </nav>
        <a className="menu__mail mono" href="mailto:shivendrashukla06@gmail.com" tabIndex={isOpen ? 0 : -1}>
          shivendrashukla06@gmail.com
        </a>
      </div>
    </>
  );
}
