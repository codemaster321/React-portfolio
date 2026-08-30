import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Typed from "typed.js";
import useSectionScroll from "../hooks/useSectionScroll";

const SKILLS_JSON = [
  { key: "frontend", value: ["React", "Next.js", "TypeScript"] },
  { key: "backend", value: ["Node.js", "FastAPI", "PostgreSQL"] },
  { key: "status", value: "Available for hire", isString: true },
];

export default function MainComponent() {
  const comp = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const scrollToSection = useSectionScroll();

  // The terminal body is hidden by CSS until `.animate` is applied, so this
  // must never be missed: check whether the loader already finished before we
  // mounted, and keep a timeout so the terminal shows even if it never signals.
  useEffect(() => {
    if (window.__loadingComplete) {
      setShouldAnimate(true);
      return;
    }

    const handleLoadingComplete = () => setShouldAnimate(true);
    window.addEventListener("loadingComplete", handleLoadingComplete);
    const failsafe = setTimeout(() => setShouldAnimate(true), 4000);

    return () => {
      window.removeEventListener("loadingComplete", handleLoadingComplete);
      clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    const typed = new Typed("#element", {
      strings: [" Coder 💻", " Web Developer 🕸️", " Nerd 🤓😎"],
      typeSpeed: 100,
      backSpeed: 120,
      loop: true,
    });

    return () => typed.destroy();
  }, []);

  useEffect(() => {
    // Hero animation sequence
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
    )
      .fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.5"
      );

    return () => tl.kill();
  }, []);

  const onClickContactHandler = () => scrollToSection(".contactSection");
  const onClickPortfolioHandler = () => scrollToSection(".portfolioSection");

  return (
    <main className="hero-main">
      <div ref={comp} className="canvas-container">
        <div className="hero-section" ref={heroRef}>
          <div className="hero-content">
            <div className="hero-badge">
              <div className="badge-icon">🚀</div>
              <span className="badge-text">
                Available for new opportunities
              </span>
            </div>

            <h1 ref={titleRef} className="hero-title">
              Hey, I&apos;m{" "}
              <span className="highlight">Shivendra Shukla</span>
            </h1>

            <p ref={descriptionRef} className="hero-description">
              I&apos;m a <span id="element" className="typed-text"></span>
            </p>

            <p className="hero-subtitle">
              Crafting digital experiences with passion and precision
            </p>

            <div ref={buttonsRef} className="hero-buttons">
              <button
                onClick={onClickContactHandler}
                className="hero-btn hero-btn--primary"
              >
                <span className="btn-text">Get in Touch</span>
                <span className="btn-icon">→</span>
              </button>
              <button
                onClick={onClickPortfolioHandler}
                className="hero-btn hero-btn--secondary"
              >
                <span className="btn-text">View Projects</span>
                <span className="btn-icon">→</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className={`terminal ${shouldAnimate ? 'animate' : ''}`}>
              <div className="terminal-header">
                <div className="window-controls">
                  <div className="control control--close"></div>
                  <div className="control control--minimize"></div>
                  <div className="control control--maximize"></div>
                </div>
                <div className="terminal-title">shivendra@portfolio ~ zsh</div>
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-path">~</span>
                  <span className="terminal-command typing-1">whoami</span>
                </div>
                <div className="terminal-output output-1">Shivendra Shukla</div>

                <div className="terminal-line line-2">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-path">~</span>
                  <span className="terminal-command typing-2">cat skills.json</span>
                </div>
                <div className="terminal-output output-2">
                  <span className="json-bracket">{"{"}</span>
                  <br />
                  {SKILLS_JSON.map(({ key, value, isString }) => (
                    <span key={key}>
                      <span className="json-key">{`"${key}"`}</span>:{" "}
                      <span className={isString ? "json-string" : "json-value"}>
                        {isString
                          ? `"${value}"`
                          : `[${value.map((v) => `"${v}"`).join(", ")}]`}
                      </span>
                      {isString ? "" : ","}
                      <br />
                    </span>
                  ))}
                  <span className="json-bracket">{"}"}</span>
                </div>

                <div className="terminal-line line-3">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-path">~</span>
                  <span className="terminal-cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
