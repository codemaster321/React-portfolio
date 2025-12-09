import { useEffect, useRef, useLayoutEffect, useState, Suspense } from "react";
import gsap from "gsap";
import Typed from "typed.js";
import NavBar from "./NavBar";

export default function MainComponent() {
  const comp = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Listen for loading screen completion event
  useEffect(() => {
    const handleLoadingComplete = () => {
      setShouldAnimate(true);
    };

    window.addEventListener('loadingComplete', handleLoadingComplete);
    return () => window.removeEventListener('loadingComplete', handleLoadingComplete);
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
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
      .fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

    setIsLoaded(true);
  }, []);

  const onClickContactHandler = () => {
    document
      .querySelector(".contactSection")
      .scrollIntoView({ behavior: "smooth" });
  };

  const onClickPortfolioHandler = () => {
    document
      .querySelector(".portfolioSection")
      .scrollIntoView({ behavior: "smooth" });
  };

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
              Hey, I'm <span className="highlight">Shivendra Shukla</span>
            </h1>

            <p ref={descriptionRef} className="hero-description">
              I'm a <span id="element" className="typed-text"></span>
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
                  <span className="json-key">"frontend"</span>: <span className="json-value">["React", "TypeScript", "Next.js"]</span>,
                  <br />
                  <span className="json-key">"backend"</span>: <span className="json-value">["Node.js", "Express", "MongoDB"]</span>,
                  <br />
                  <span className="json-key">"status"</span>: <span className="json-string">"Available for hire"</span>
                  <br />
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
