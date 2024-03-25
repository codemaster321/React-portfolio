import { useEffect } from "react";
import Typed from "typed.js";
import Square from "./Square";

export default function MainComponent() {
  useEffect(() => {
    const typed = new Typed("#element", {
      strings: [" Coder 💻", " Web Developer 🕸️", " Nerd 🤓😎"],
      typeSpeed: 100,
      backSpeed: 120,
      loop: true,
    });

    return () => typed.destroy();
  }, []);

  return (
    <>
      <main>
        <div className="canvas-container">
          <div className="about-me">
            <h1>Hey this is Shivendra Shukla!</h1>

            <p className="about-me--description">
              I'm a <span id="element"></span>
            </p>

            <div className="btns">
              <button className="btn1 btn--1">Contact me</button>
              <button className="btn1 btn--2">Past Projects</button>
            </div>
          </div>

          <Square />
        </div>

        <div className="marquee">
          <p>I have been programming too much I can barely cout of my eyes</p>
        </div>
      </main>
    </>
  );
}
