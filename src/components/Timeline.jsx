import HoverText from "./HoverText";
import { useLayoutEffect, useRef } from "react";
import { useReveal } from "../lib/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Timeline.css";
import useNearViewport from "../hooks/useNearViewport";

gsap.registerPlugin(ScrollTrigger);

// Most recent first, the way a CV reads.
const ENTRIES = [
  {
    period: "2026 — Now",
    role: "Senior Software Engineer",
    org: "Quess Corp",
    current: true,
  },
  {
    period: "2024 — 2026",
    role: "Freelance Full-Stack Developer",
    org: "Independent",
    summary: "AI agent platforms, subscription web apps and marketing sites, shipped end to end for clients.",
  },
  {
    period: "2022 — 2024",
    role: "Associate IT Consultant",
    org: "ITC Infotech",
    summary: "IT development and consulting.",
  },
  {
    period: "2018 — 2022",
    role: "Computer Science",
    org: "DIT University, Dehradun",
  },
];

export default function Timeline() {
  const root = useRef(null);
  const near = useNearViewport(root);
  useReveal(root, ".section__head");

  useLayoutEffect(() => {
    if (!near) return;
    const section = root.current;
    const rows = Array.from(section.querySelectorAll(".exp__row"));
    const track = section.querySelector(".exp__track");
    const markerOffset = (row) => {
      const marker = row.querySelector(".exp__marker");
      return marker.offsetTop + marker.offsetHeight / 2;
    };
    const measureTrack = () => {
      const first = rows[0].offsetTop + markerOffset(rows[0]);
      const last = rows.at(-1).offsetTop + markerOffset(rows.at(-1));
      track.style.top = `${first}px`;
      track.style.height = `${last - first}px`;
    };
    measureTrack();
    ScrollTrigger.addEventListener("refreshInit", measureTrack);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // A solid HTML fill avoids SVG dash lengths changing when the narrow
      // viewBox is stretched to the full height of the experience list.
      gsap.fromTo(section.querySelector(".exp__draw"), { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: {
          trigger: rows[0], start: () => `top+=${markerOffset(rows[0])} 50%`,
          endTrigger: rows.at(-1), end: () => `top+=${markerOffset(rows.at(-1))} 50%`,
          scrub: true, invalidateOnRefresh: true,
        },
      });
    }, root);
    const resize = new ResizeObserver(() => ScrollTrigger.refresh());
    resize.observe(section.querySelector(".exp__list"));
    return () => {
      resize.disconnect();
      ScrollTrigger.removeEventListener("refreshInit", measureTrack);
      media.revert();
    };
  }, [near]);

  return (
    <section className="section exp exp--drawn" id="experience" ref={root}>
      <header className="section__head" data-reveal>
        <h2 className="section__title"><HoverText text="Experience" /></h2>
      </header>

      <div className="exp__journey">
        <div className="exp__track" aria-hidden="true">
          <span className="exp__draw" />
        </div>
        <ol className="exp__list">
          {ENTRIES.map(({ period, role, org, summary, current }) => (
            <li className="exp__row" key={`${period}-${role}`}>
              <span className={`exp__marker${current ? " exp__marker--current" : ""}`} aria-hidden="true" />
              <span className="exp__period mono">{period}</span>
              <div className="exp__panel">
                <h3 className="exp__role">{role}</h3>
                {summary && <p className="exp__summary">{summary}</p>}
              </div>
              <p className="exp__org">{org}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
