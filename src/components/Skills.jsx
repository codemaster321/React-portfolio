import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Skill from "./Skill";

const Skills = function Skills() {
  const refSkills = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".skill-group", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        immediateRender: false,
        scrollTrigger: {
          trigger: ".section--skills",
          start: "top 90%",
          once: true,
        },
      });
    }, refSkills);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section--skills section">
      <div className="section--header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="skill--icon"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
        <h2 className="heading">Skills</h2>
        <p className="section--subtitle">
          The stack I reach for when building and shipping products.
        </p>
      </div>

      <div ref={refSkills} className="skills">
        <Skill />
      </div>
    </section>
  );
};

export default Skills;
