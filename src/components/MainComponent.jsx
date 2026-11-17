import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import useSectionScroll from "../hooks/useSectionScroll";
import HoverText from "./HoverText";
import SystemDiagram from "./SystemDiagram";
import { EASE, prefersReducedMotion, useIntroComplete, useMagnetic } from "../lib/motion";

// Each entry is one masked line of the headline. Splitting by line (rather
// than letting the browser wrap) is what lets each line rise out of its mask.
const HEADLINE = [
  [{ text: "I build" }],
  [{ text: "AI agents", accent: true }],
  [{ text: "& products" }],
  [{ text: "that actually ship." }],
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
  const scrollToSection = useSectionScroll(0);

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
    <section className="hero hero--system" id="top" ref={root}>
      <div className="hero__meta mono" data-hero-fade>
        <span>Python Full-Stack Developer</span>
        <span>AI &amp; Agents</span>
        <span className="status">
          <i className="status__dot" aria-hidden="true" />
          Open to opportunities
        </span>
      </div>

      <div className="hero__composition">
        <div className="hero__copy">
          <h1 className="hero__title" aria-label="I build AI agents and products that actually ship.">
            {HEADLINE.map((line, i) => (
              <span className="hero__line" key={i} aria-hidden="true">
                <span className="hero__line-inner">
                  {line.map(({ text, accent }) =>
                    accent ? (
                      <em key={text}><HoverText text={text} /></em>
                    ) : (
                      <HoverText key={text} text={text} />
                    )
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero__intro" data-hero-fade>
            I&apos;m Shivendra Shukla, a Python full-stack developer and senior
            software engineer at Quess Corp. I build FastAPI backends, multi-agent
            systems and the React front ends around them, from first sketch to
            production.
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
        <span>Python / FastAPI / React</span>
        <span className="hero__scroll" aria-hidden="true">
          Scroll to explore <span className="hero__scroll-line" />
        </span>
      </div>
    </section>
  );
}
