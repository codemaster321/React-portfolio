import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import useSectionScroll from "../hooks/useSectionScroll";
import HoverText from "./HoverText";
import { EASE, prefersReducedMotion, useIntroComplete, useMagnetic } from "../lib/motion";

// Each entry is one masked line of the headline. Splitting by line (rather
// than letting the browser wrap) is what lets each line rise out of its mask.
const HEADLINE = [
  [{ text: "I build" }, { text: " " }, { text: "AI agents", accent: true }],
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

  // Hide the animated parts before first paint so there's no flash of the
  // final state while the intro curtain is still up.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero__line-inner", { yPercent: 110 });
      gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!introDone || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE } })
        .to(".hero__line-inner", { yPercent: 0, duration: 1.4, stagger: 0.1 })
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, "-=1.0");
    }, root);
    // Not reverted on cleanup: reverting would snap the hero back to hidden.
    return () => ctx.kill();
  }, [introDone]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__meta mono" data-hero-fade>
        <span>Python Full-Stack Developer</span>
        <span>AI &amp; Agents</span>
        <span className="status">
          <i className="status__dot" aria-hidden="true" />
          Open to opportunities
        </span>
      </div>

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

      <div className="hero__foot">
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

        <span className="hero__scroll mono" data-hero-fade aria-hidden="true">
          Scroll <span className="hero__scroll-line" />
        </span>
      </div>
    </section>
  );
}
