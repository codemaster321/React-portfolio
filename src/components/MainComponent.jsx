import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import useSectionScroll from "../hooks/useSectionScroll";
import HoverText from "./HoverText";
import SystemDiagram from "./SystemDiagram";
import { EASE, prefersReducedMotion, useIntroComplete, useMagnetic } from "../lib/motion";

const HEADLINE = [
  { text: "AI agents", accent: true },
  { text: "built to ship." },
];

function MagneticButton({ children, className, onClick }) {
  const ref = useRef(null);
  useMagnetic(ref);
  return (
    <button ref={ref} type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default function MainComponent() {
  const root = useRef(null);
  const introDone = useIntroComplete();
  const scrollToSection = useSectionScroll();

  useEffect(() => {
    const hero = root.current;
    const media = gsap.matchMedia();

    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const moveSpotlight = (event) => {
        if (event.pointerType === "touch") return;
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty("--hero-spot-x", `${event.clientX - bounds.left}px`);
        hero.style.setProperty("--hero-spot-y", `${event.clientY - bounds.top}px`);
      };
      hero.addEventListener("pointerenter", moveSpotlight);
      hero.addEventListener("pointermove", moveSpotlight);

      return () => {
        hero.removeEventListener("pointerenter", moveSpotlight);
        hero.removeEventListener("pointermove", moveSpotlight);
        hero.style.removeProperty("--hero-spot-x");
        hero.style.removeProperty("--hero-spot-y");
      };
    });

    return () => media.revert();
  }, []);

  // Keep the heading readable at first paint. Desktop gets a small lift;
  // mobile avoids holding useful content behind an entrance animation.
  useLayoutEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(max-width: 900px)").matches) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero__line-inner", { y: 12 });
      gsap.set("[data-hero-fade]", { y: 8 });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!introDone || prefersReducedMotion() || window.matchMedia("(max-width: 900px)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE } })
        .to(".hero__line-inner", { y: 0, duration: 0.55, stagger: 0.05 })
        .to("[data-hero-fade]", { y: 0, duration: 0.45, stagger: 0.04 }, 0.15);
    }, root);
    // Not reverted on cleanup: reverting would snap the hero back to hidden.
    return () => ctx.kill();
  }, [introDone]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__composition">
        <div className="hero__copy">
          <p className="hero__role mono" data-hero-fade>Python full-stack developer</p>
          <h1 className="hero__title" aria-label="AI agents built to ship.">
            {HEADLINE.map(({ text, accent }) => (
              <span className="hero__line" key={text} aria-hidden="true">
                <span className="hero__line-inner">
                  {accent ? <em><HoverText text={text} /></em> : <HoverText text={text} />}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero__intro" data-hero-fade>
            I&apos;m Shivendra Shukla, a senior software engineer at Quess Corp.
            I build multi-agent systems, FastAPI backends and the React products people use to work with them.
          </p>

          <div className="hero__actions" data-hero-fade>
            <MagneticButton className="btn btn--solid" onClick={() => scrollToSection("#work")}>
              See selected work <span aria-hidden="true">↓</span>
            </MagneticButton>
            <MagneticButton className="btn btn--ghost" onClick={() => scrollToSection("#contact")}>
              Get in touch <span aria-hidden="true">→</span>
            </MagneticButton>
          </div>
        </div>
        <SystemDiagram ready={introDone} />
      </div>
      <div className="hero__baseline mono" data-hero-fade>
        <span className="status">
          <i className="status__dot" aria-hidden="true" />
          Open to opportunities
        </span>
        <span>Python / FastAPI / React</span>
      </div>
    </section>
  );
}
