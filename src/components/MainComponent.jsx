import { useEffect, useRef, useLayoutEffect, useState, Suspense } from "react";
import gsap from "gsap";
import Typed from "typed.js";
import Square from "./Square";
import NavBar from "./NavBar";

export default function MainComponent() {
  const comp = useRef(null);
  console.log(comp.current);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from(".about-me", {
        opacity: 0,
        xPercent: "-50",
        duration: 1,
        delay: 0,
      })
        .from(".about-me--description", {
          opacity: 0,
          xPercent: "+50",
          duration: 1,
          delay: 0,
        })
        .from(["#btn--1, #btn--2"], {
          opacity: 0,
          xPercent: "+=50",
          duration: 1,
          stagger: 0.5,
          delay: 1,
        });
    }, comp.current);

    return () => ctx.revert();
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
    <main>
      {/* <video loop muted autoPlay preload="auto">
        <source src="stars.mp4" type="video/mp4" />
      </video> */}

      <div ref={comp} className="canvas-container">
        <div className="about-me">
          <h1>Hey this is Shivendra Shukla!</h1>

          <p className="about-me--description">
            I'm a <span id="element"></span>
          </p>

          <div className="btns">
            <button
              onClick={onClickContactHandler}
              className="btn1 btn--1"
              id="btn--1"
            >
              Contact me
            </button>
            <button
              onClick={onClickPortfolioHandler}
              className="btn1 btn--2"
              id="btn--2"
            >
              Past Projects
            </button>
          </div>
        </div>
        <Square />
      </div>
    </main>
  );
}
