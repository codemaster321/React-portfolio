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
      rows.forEach((row) => {
        gsap.fromTo(row.querySelector(".exp__marker"), { scale: 0.65, backgroundColor: "#44463a" }, {
          scale: 1, backgroundColor: "#d4ff3a", duration: 0.15,
          scrollTrigger: {
            trigger: row, start: () => `top+=${markerOffset(row)} 50%`,
            toggleActions: "play none none reverse", invalidateOnRefresh: true,
          },
        });
        // Each row owns a separate scroll interval. The next row starts only
        // after this one's bottom crosses the same reading line.
        const progress = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: row, start: () => `top+=${markerOffset(row)} 50%`, end: "bottom 50%", scrub: true,
            invalidateOnRefresh: true,
            toggleClass: { targets: row, className: "is-current" },
          },
        });
        progress
          .fromTo(row.querySelector(".exp__year"), { "--year-fill": "0%" },
            { "--year-fill": "100%", duration: 0.35 }, 0.15)
          .fromTo(row.querySelector(".exp__rule"), { "--rule-fill": 0 },
            { "--rule-fill": 1, duration: 0.5 }, 0.5);
        const entrance = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: row, start: "top 92%", end: "top 48%", scrub: 0.55, invalidateOnRefresh: true },
        });
        entrance
          .from(row.querySelector(".exp__year"), { x: -35, opacity: 0, duration: 0.8 }, 0)
          .from(row.querySelector(".exp__period"), { y: 16, opacity: 0, duration: 0.5 }, 0.15)
          .from(row.querySelector(".exp__panel"), { y: 35, rotationX: 5, transformOrigin: "center bottom", duration: 1 }, 0)
          .from(row.querySelectorAll(".exp__word-inner"), { yPercent: 115, rotation: 4, stagger: 0.09, duration: 0.7 }, 0.1)
          .from(row.querySelector(".exp__org"), { y: 22, opacity: 0, duration: 0.6 }, 0.4);
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
        <span className="section__index mono">(03)</span>
        <h2 className="section__title"><HoverText text="Experience" /></h2>
      </header>

      <div className="exp__journey">
        <div className="exp__track" aria-hidden="true">
          <span className="exp__draw" />
        </div>
      <ol className="exp__list">
        {ENTRIES.map(({ period, role, org, summary, current }, index) => (
          <li className="exp__row" key={`${period}-${role}`}>
            <span className="exp__marker" aria-hidden="true" />
            <div className="exp__date">
              <span className="exp__year" aria-hidden="true">{period.slice(0, 4)}</span>
              <span className="exp__period mono">
                {current && <i className="status__dot" aria-label="Current role" />}
                {period}
              </span>
            </div>
            <div className="exp__panel">
              <span className="exp__chapter mono">{String(index + 1).padStart(2, "0")} / {current ? "Present" : index === ENTRIES.length - 1 ? "Education" : "Experience"}</span>
              <h3 className="exp__role">
                {role.split(" ").map((word, i) => <span key={i}>
                  <span className="exp__word-mask"><span className="exp__word-inner">{word}</span></span>{" "}
                </span>)}
              </h3>
              <div className="exp__org">
                <span>{org}</span>
                {summary && <p className="exp__summary">{summary}</p>}
              </div>
              <span className="exp__rule" aria-hidden="true" />
            </div>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}
