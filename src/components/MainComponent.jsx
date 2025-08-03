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
            <div className="code-editor">
              <div className="editor-header">
                <div className="window-controls">
                  <div className="control control--close"></div>
                  <div className="control control--minimize"></div>
                  <div className="control control--maximize"></div>
                </div>
                <div className="file-tab">main.jsx</div>
              </div>
              <div className="editor-content">
                <div className="line-numbers">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                </div>
                <div className="code-lines">
                  <div className="code-line">
                    <span className="keyword">const</span>{" "}
                    <span className="variable">developer</span> = {"{"}
                  </div>
                  <div className="code-line">
                    <span className="property">name</span>:{" "}
                    <span className="string">"Shivendra"</span>,
                  </div>
                  <div className="code-line">
                    <span className="property">role</span>:{" "}
                    <span className="string">"Full Stack Developer"</span>,
                  </div>
                  <div className="code-line">
                    <span className="property">skills</span>: [
                  </div>
                  <div className="code-line">
                    <span className="string">"React"</span>,{" "}
                    <span className="string">"Node.js"</span>,{" "}
                    <span className="string">"TypeScript"</span>
                  </div>
                  <div className="code-line">],</div>
                  <div className="code-line">
                    <span className="property">passion</span>:{" "}
                    <span className="string">"Building amazing apps"</span>
                  </div>
                  <div className="code-line">{"}"};</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
