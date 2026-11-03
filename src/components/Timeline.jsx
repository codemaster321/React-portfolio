import HoverText from "./HoverText";
import { useRef } from "react";
import { useReveal } from "../lib/motion";

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
  useReveal(root);

  return (
    <section className="section exp" id="experience" ref={root}>
      <header className="section__head" data-reveal>
        <span className="section__index mono">(03)</span>
        <h2 className="section__title"><HoverText text="Experience" /></h2>
      </header>

      <ol className="exp__list">
        {ENTRIES.map(({ period, role, org, summary, current }) => (
          <li className="exp__row" key={`${period}-${role}`} data-reveal>
            <span className="exp__period mono">
              {current && <i className="status__dot" aria-label="Current role" />}
              {period}
            </span>
            <span className="exp__role"><HoverText text={role} /></span>
            <span className="exp__org">
              {org}
              {summary && <span className="exp__summary">{summary}</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
