import Project from "./Project";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

const Portfolio = function Portfolio(props) {
  const refProject = useRef(null);

  const projects = [
    {
      id: 1,
      projectTitle: "Forkify App: Made a web app for managing recipe",
    },

    {
      id: 2,
      projectTitle:
        "Made a app in node.js from scratch to track the medicines and their expiry date",
    },
    {
      id: 3,
      projectTitle: "Made a video chat app in reactjs using WebRTC",
    },
    {
      id: 4,
      projectTitle: "Made a web app in Javascript called Pig Game",
    },
  ];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".portfolioSection ",
        start: "top+=200 50%", // when the top of the trigger hits the centre of the viewport
        end: "+=500px", // end after scrolling 400px beyond the start
        scrub: 1,
      },
    });

    const q = gsap.utils.selector(refProject);
    q(".util-box").forEach((el) => {
      console.log(el);
      tl.from(el, { x: "-=100", opacity: 0 }).to(el, {
        x: 0,
        opacity: 1,
      });
    });
  }, []);
  return (
    <section className="portfolioSection section">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="cpu--icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
          />
        </svg>
        <h1 className="heading">Past Projects</h1>
      </div>
      <div ref={refProject} className="portfolio">
        {projects.map((project) => {
          return (
            <Project
              key={project.id}
              title={`Project ${project.id}`}
              project={project.projectTitle}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Portfolio;
