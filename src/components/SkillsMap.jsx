import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SkillsMap.css";
import useNearViewport from "../hooks/useNearViewport";

gsap.registerPlugin(Flip, DrawSVGPlugin, ScrollTrigger);

const GROUPS = [
  { name: "AI", note: "From context to coordinated action.",
    skills: ["CrewAI", "pgvector", "LangChain", "GPT-4o"],
    projects: [{ id: "modelhub", name: "ModelHub", detail: "CrewAI / pgvector" },
      { id: "sleeplog", name: "SleepLog", detail: "LangChain" },
      { id: "procurement", name: "Procurement AI", detail: "GPT-4o" }] },
  { name: "Backend", note: "The services behind the experience.",
    skills: ["FastAPI", "pgvector", "Supabase", "Node.js", "MongoDB"],
    projects: [{ id: "modelhub", name: "ModelHub", detail: "FastAPI / pgvector" },
      { id: "sleeplog", name: "SleepLog", detail: "Supabase" },
      { id: "procurement", name: "Procurement AI", detail: "Node.js / MongoDB" }] },
  { name: "Frontend", note: "Interfaces that make the system usable.",
    skills: ["Next.js", "React Router", "Tailwind"],
    projects: [{ id: "sleeplog", name: "SleepLog", detail: "Next.js 15" },
      { id: "charvaka", name: "Charvaka Recovery", detail: "React Router / Tailwind" }] },
];

export default function SkillsMap({ onOpenProject }) {
  const [selected, setSelected] = useState(0);
  const root = useRef(null);
  const near = useNearViewport(root);
  const previous = useRef(null);
  const motion = useRef(null);
  const group = GROUPS[selected];

  useLayoutEffect(() => {
    if (!near) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      motion.current = tl;
      if (previous.current) tl.add(Flip.from(previous.current, {
        duration: 0.5, ease: "power3.inOut", scale: false,
      }), 0);
      tl.fromTo(".skills-map__wire", { drawSVG: "0%" },
        { drawSVG: "100%", stagger: 0.07, duration: 0.65, ease: "power2.inOut" }, 0.1);
      return () => { motion.current = null; };
    }, root);
    previous.current = null;
    ScrollTrigger.refresh();
    return () => media.revert();
  }, [selected, near]);

  const select = (index) => {
    if (index === selected) return;
    motion.current?.progress(1);
    previous.current = Flip.getState(root.current.querySelectorAll("[data-flip-id]"));
    setSelected(index);
  };

  return (
    <div className="skills-map" ref={root}>
      <div className="skills-map__head">
        <div><p className="mono skills-map__eyebrow">Skills, connected to work</p>
          <h3>Tools to shipped products.</h3></div>
        <div className="skills-map__filters" role="group" aria-label="Explore skills by discipline">
          {GROUPS.map(({ name }, i) => <button key={name} type="button"
            aria-pressed={selected === i} onClick={() => select(i)}>{name}</button>)}
        </div>
      </div>
      <p className="skills-map__note" aria-live="polite">{group.note}</p>
      <div className="skills-map__canvas">
        <ul className="skills-map__tools" aria-label={`${group.name} technologies`}>
          {group.skills.map((name) => <li key={name} data-flip-id={`skill-${name}`}>{name}</li>)}
        </ul>
        <div className="skills-map__connections" aria-hidden="true">
          <svg viewBox="0 0 160 240" preserveAspectRatio="none">
            {group.projects.map(({ id }, i) => <path className="skills-map__wire" key={id}
              d={`M0 120 H50 Q80 120 80 ${120 + ((i + 0.5) * 240 / group.projects.length - 120) / 2} V${(i + 0.5) * 240 / group.projects.length} H160`} />)}
          </svg>
          <span>BUILT<br />WITH</span>
        </div>
        <ul className="skills-map__projects" aria-label="Related case studies">
          {group.projects.map(({ id, name, detail }) => <li key={id} data-flip-id={`map-${id}`}>
            <a href={`#project-${id}`} onClick={(event) => {
              if (onOpenProject && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                event.preventDefault(); onOpenProject(id);
              }
            }}>
              <span><strong>{name}</strong><small>{detail}</small></span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>)}
        </ul>
      </div>
      <p className="mono skills-map__hint">Choose a discipline. Open a build.</p>
    </div>
  );
}
