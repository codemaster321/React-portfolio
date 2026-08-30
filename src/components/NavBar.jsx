import { useEffect, useRef, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import useSectionScroll from "../hooks/useSectionScroll";

const NAV_ITEMS = [
  { label: "Portfolio", target: ".portfolioSection" },
  { label: "Skills", target: ".section--skills" },
  { label: "Experience", target: ".timeline" },
  { label: "Contact", target: ".contactSection" },
];

export default function NavBar() {
  const headerRef = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const scrollToSection = useSectionScroll();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    header.classList.toggle("nav-open", isNavOpen);
  }, [isNavOpen]);

  // Close the mobile menu on Escape so it can't trap the user.
  useEffect(() => {
    if (!isNavOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setIsNavOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isNavOpen]);

  const handleNavClick = (target) => {
    setIsNavOpen(false);
    scrollToSection(target);
  };

  return (
    <header ref={headerRef}>
      <h2 className="nav-title" id="heading">
        !Shiv
      </h2>

      <nav className="main-nav" id="navbar" aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, target }) => (
          <div className="e" key={label}>
            <button
              type="button"
              onClick={() => handleNavClick(target)}
              className="main-nav-link"
            >
              {label}
            </button>
          </div>
        ))}
      </nav>

      <button
        onClick={() => setIsNavOpen((open) => !open)}
        className="btn-mobile-nav"
        aria-label={isNavOpen ? "Close menu" : "Open menu"}
        aria-expanded={isNavOpen}
        aria-controls="navbar"
      >
        {isNavOpen ? (
          <HiX className="icon-mobile-nav" aria-hidden="true" />
        ) : (
          <HiMenu className="icon-mobile-nav" aria-hidden="true" />
        )}
      </button>
    </header>
  );
}
