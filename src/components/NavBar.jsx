import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSectionScroll from "../hooks/useSectionScroll";
import "./NavBar.css";

const NAV_ITEMS = [
  { label: "Work", target: "#work", note: "Selected builds. From the first idea to production.", caption: "Explore the projects" },
  { label: "About", target: "#about", note: "Python-first thinking. Interfaces that make it useful.", caption: "Meet the developer" },
  { label: "Experience", target: "#experience", note: "The roles, projects and people behind the practice.", caption: "Follow the journey" },
  { label: "Contact", target: "#contact", note: "Have a problem worth solving? Let's build something.", caption: "Start a conversation" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [focusIndex, setFocusIndex] = useState(null);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const linksRef = useRef([]);
  const menuRef = useRef(null);
  const positionIndicator = useRef(() => {});
  const toggleRef = useRef(null);
  const menuAnimation = useRef(null);
  const [menuPreview, setMenuPreview] = useState(null);
  const previewItem = menuPreview ?? activeIndex ?? 0;
  const lenis = useLenis();
  const scrollToSection = useSectionScroll(-84);
  const displayedIndex = hoverIndex ?? focusIndex ?? activeIndex;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      menuAnimation.current = gsap.timeline({ paused: true,
        onReverseComplete: () => gsap.set(menuRef.current, { autoAlpha: 0 }),
      })
        .fromTo(menuRef.current, { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power3.inOut" })
        .fromTo(".menu__word", { yPercent: 115, rotation: 3 },
          { yPercent: 0, rotation: 0, duration: 0.65, stagger: 0.07, ease: "power3.out" }, 0.2)
        .fromTo(".menu__index", { x: -18, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.07 }, 0.3)
        .fromTo(".menu__top, .menu__aside, .menu__bottom", { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.07 }, 0.35);
    }, menuRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const animation = menuAnimation.current;
      if (isOpen) gsap.set(menuRef.current, { autoAlpha: 1 });
      if (reduced.matches) {
        animation.progress(isOpen ? 1 : 0).pause();
        gsap.set(menuRef.current, { autoAlpha: isOpen ? 1 : 0 });
      } else if (isOpen) animation.timeScale(1).play();
      else animation.timeScale(1.4).reverse();
    };
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, [isOpen]);

  useEffect(() => {
    let frame = 0;
    const sections = NAV_ITEMS.map(({ target }) => document.querySelector(target));
    const measure = () => {
      frame = 0;
      const readingLine = Math.min(window.innerHeight * 0.35, 240);
      let next = null;
      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top <= readingLine) next = index;
      });
      setActiveIndex((current) => current === next ? current : next);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    lenis?.on("scroll", schedule);
    ScrollTrigger.addEventListener("refresh", schedule);
    // Expansion of a case study changes the section positions without a scroll.
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    observer?.observe(document.body);
    measure();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      lenis?.off("scroll", schedule);
      ScrollTrigger.removeEventListener("refresh", schedule);
      observer?.disconnect();
    };
  }, [lenis]);

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const nav = navRef.current;
    let animation;
    const position = (instant = false) => {
      animation?.kill();
      const button = linksRef.current[displayedIndex];
      if (!button || !nav.offsetWidth) {
        gsap.set(indicator, { opacity: 0 });
        return;
      }
      const x = button.offsetLeft;
      const width = button.querySelector(".nav__link-label").offsetWidth;
      const currentX = Number(gsap.getProperty(indicator, "x")) || 0;
      const currentWidth = parseFloat(gsap.getProperty(indicator, "width")) || 0;
      if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !Number(gsap.getProperty(indicator, "opacity"))) {
        gsap.set(indicator, { x, width, opacity: 1 });
        return;
      }
      const left = Math.min(currentX, x);
      const right = Math.max(currentX + currentWidth, x + width);
      animation = gsap.timeline()
        .to(indicator, { x: left, width: right - left, opacity: 1, duration: 0.18, ease: "power2.out" })
        .to(indicator, { x, width, duration: 0.26, ease: "power3.out" });
    };
    positionIndicator.current = position;
    position();
    return () => animation?.kill();
  }, [displayedIndex]);

  useLayoutEffect(() => {
    let mounted = true;
    const reposition = () => positionIndicator.current(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(reposition) : null;
    observer?.observe(navRef.current);
    linksRef.current.forEach((link) => observer?.observe(link));
    window.addEventListener("resize", reposition);
    reduced.addEventListener("change", reposition);
    document.fonts?.ready.then(() => { if (mounted) reposition(); });
    return () => {
      mounted = false;
      observer?.disconnect();
      window.removeEventListener("resize", reposition);
      reduced.removeEventListener("change", reposition);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const menu = menuRef.current;
    const toggle = toggleRef.current;
    const background = [document.querySelector("#main"), document.querySelector(".footer-reveal")].filter(Boolean);
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    menu.querySelector(".menu__link")?.focus({ preventScroll: true });
    const close = () => {
      setIsOpen(false);
      toggle?.focus({ preventScroll: true });
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab") return;
      const controls = [...menu.querySelectorAll("button, a[href]")];
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls.at(-1)?.focus();
      } else if (!event.shiftKey && (index === controls.length - 1 || index < 0)) {
        event.preventDefault();
        controls[0]?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      lenis?.start();
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus({ preventScroll: true });
    };
  }, [isOpen, lenis]);

  const go = (target) => {
    // Resume synchronously: the effect cleanup runs after this scroll request.
    if (isOpen) {
      lenis?.start();
      toggleRef.current?.focus({ preventScroll: true });
    }
    setIsOpen(false);
    setHoverIndex(null);
    setFocusIndex(null);
    scrollToSection(target);
  };

  return (
    <>
      <header className="nav nav--tracked" inert={isOpen ? "" : undefined} aria-hidden={isOpen || undefined}>
        <button type="button" className="nav__brand" onClick={() => go("#top")}>
          <span className="nav__brand-mark mono" aria-hidden="true">SS</span>
          <span data-intro-brand>Shivendra Shukla</span>
        </button>
        <nav className="nav__links" aria-label="Main navigation" ref={navRef} onMouseLeave={() => setHoverIndex(null)}>
          {NAV_ITEMS.map(({ label, target }, index) => (
            <button
              ref={(element) => { linksRef.current[index] = element; }}
              type="button"
              key={label}
              className="nav__link"
              aria-current={activeIndex === index ? "location" : undefined}
              onClick={() => go(target)}
              onMouseEnter={() => setHoverIndex(index)}
              onFocus={() => setFocusIndex(index)}
              onBlur={() => setFocusIndex(null)}
            >
              <span className="nav__link-label">{label}</span>
            </button>
          ))}
          <span ref={indicatorRef} className="nav__indicator" aria-hidden="true" />
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle mono"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="portfolio-menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </header>
      <div id="portfolio-menu" ref={menuRef} className={`menu menu--tracked menu--editorial${isOpen ? " menu--open" : ""}`}
        role="dialog" aria-modal={isOpen ? "true" : undefined} aria-label="Explore portfolio" data-lenis-prevent
        aria-hidden={!isOpen} inert={isOpen ? undefined : ""}>
        <div className="menu__top mono">
          <span>Shivendra Shukla / Portfolio</span>
          <button type="button" className="menu__close" tabIndex={isOpen ? 0 : -1}
            onClick={() => { setIsOpen(false); toggleRef.current?.focus({ preventScroll: true }); }}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="menu__layout">
        <nav aria-label="Portfolio navigation" onPointerLeave={() => setMenuPreview(null)}>
          {NAV_ITEMS.map(({ label, target }, index) => (
            <button
              type="button"
              key={label}
              className="menu__link"
              aria-current={activeIndex === index ? "location" : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => go(target)}
              onPointerEnter={() => setMenuPreview(index)}
              onFocus={() => setMenuPreview(index)}
              onBlur={() => setMenuPreview(null)}
            >
              <span className="menu__index mono">0{index + 1}</span>
              <span className="menu__mask"><span className="menu__word">{label}</span></span>
              <span className="menu__arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>
        <aside className="menu__aside" aria-hidden="true">
          <div key={previewItem} className="menu__preview">
            <span className="menu__preview-number">0{previewItem + 1}</span>
            <p className="menu__caption mono">{NAV_ITEMS[previewItem].caption}</p>
            <p className="menu__description">{NAV_ITEMS[previewItem].note}</p>
          </div>
        </aside>
        </div>
        <div className="menu__bottom">
        <a className="menu__mail mono" href="mailto:shivendrashukla06@gmail.com" tabIndex={isOpen ? 0 : -1}>
          shivendrashukla06@gmail.com
        </a>
        <span className="mono">Python / AI / Interfaces</span>
        </div>
      </div>
    </>
  );
}
