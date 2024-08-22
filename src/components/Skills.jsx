import { Suspense, useLayoutEffect, useRef } from "react";
import Skill from "./Skill";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Skills = function Skills(props) {
  const skills = ["Vanilla JS", "Node", "HTML", "CSS", "Python", "React"];

  const refSkills = useRef();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section--skills",
        start: "top-=100 50%", // when the top of the trigger hits the top of the viewport
        end: "+=400px", // end after scrolling 500px beyond the start
        scrub: 1,
      },
    });

    tl.from(refSkills.current, { y: 300, opacity: 0 }).to(refSkills.current, {
      y: 0,
      opacity: 1,
    });
  }, []);
  return (
    <Suspense fallback="Loading....">
      <section className="section--skills section">
        <div ref={refSkills} className="skills">
          <div className="skill--heading">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="skill--icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>

            <h1 className="heading">Skills</h1>
          </div>
          <div className="skills-list">
            {skills.map((skill) => (
              <Skill skill={skill} />
            ))}
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Skills;
