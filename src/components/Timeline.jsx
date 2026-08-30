import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Most recent first, the way a CV reads.
const ENTRIES = [
  {
    period: "Feb 2026 — Present",
    role: "Senior Software Engineer",
    org: "Quess Corp",
    current: true,
  },
  {
    period: "Feb 2024 — Jan 2026",
    role: "Freelance Full Stack Developer",
    org: "Independent",
    summary:
      "Designed and shipped full-stack products end to end for clients — AI agent platforms, subscription web apps, and marketing sites.",
  },
  {
    period: "2022 — 2024",
    role: "Associate IT Consultant",
    org: "ITC Infotech",
    location: "India",
    summary: "IT development and consulting.",
  },
  {
    period: "2018 — 2022",
    role: "Student",
    org: "DIT University",
    location: "Dehradun, India",
    summary: "Computer science studies.",
  },
];

export default function Timeline() {
  const listRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".timeline-entry", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        immediateRender: false,
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 90%",
          once: true,
        },
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="timeline section">
      <div className="section--header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="cpu--icon"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="heading">Experience</h2>
        <p className="section--subtitle">Where I&apos;ve worked and studied.</p>
      </div>

      <ol className="timeline-list" ref={listRef}>
        {ENTRIES.map(({ period, role, org, location, summary, current }) => (
          <li
            className={`timeline-entry${current ? " timeline-entry--current" : ""}`}
            key={`${period}-${role}`}
          >
            <span className="timeline-entry__marker" aria-hidden="true" />

            <div className="timeline-entry__card">
              <span className="timeline-entry__period">
                {period}
                {current && <span className="timeline-entry__badge">Current</span>}
              </span>
              <h3 className="timeline-entry__role">{role}</h3>
              <p className="timeline-entry__org">
                {org}
                {location && (
                  <span className="timeline-entry__location"> · {location}</span>
                )}
              </p>
              {summary && (
                <p className="timeline-entry__summary">{summary}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
