import HoverText from "./HoverText";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReveal } from "../lib/motion";

const STATEMENT =
  "I like the hard middle of a product — the stretch between a messy idea and something people actually use. I work Python-first: FastAPI services, multi-agent systems and retrieval pipelines, with the React front ends wrapped around them.";

const CAPABILITIES = [
  {
    title: "Python & Backend",
    items: ["Python", "FastAPI", "PostgreSQL", "pgvector", "MongoDB", "Supabase", "Node.js", "Express", "Stripe"],
  },
  {
    title: "AI & Agents",
    items: ["OpenAI", "LangChain", "LangGraph", "CrewAI", "Ollama", "RAG"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Vite", "Chart.js"],
  },
  {
    title: "DevOps & Tooling",
    items: ["Docker", "Nginx", "GitHub Actions", "Vercel", "Cloudflare", "Git"],
  },
];

export default function About() {
  const root = useRef(null);
  useReveal(root);

  // The statement pins mid-screen and scrolling fills it word by word; the
  // page only moves on once the last word is filled.
  // Kept under reduced motion: nothing slides, the text only changes colour,
  // and the visitor's own scrolling drives it.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about__word",
        { backgroundPosition: "100% 0%" },
        {
          backgroundPosition: "0% 0%",
          ease: "none",
          stagger: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ".about__pin",
            start: "center center",
            // Scroll distance scales with the text so each word gets the
            // same amount of wheel travel.
            end: () => `+=${STATEMENT.split(" ").length * 28}`,
            pin: true,
            scrub: 0.6,
            // Refresh before the reveal triggers further down the page, so
            // they measure their positions with the pin spacing in place.
            refreshPriority: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section about" id="about" ref={root}>
      <header className="section__head" data-reveal>
        <span className="section__index mono">(02)</span>
        <h2 className="section__title"><HoverText text="About" /></h2>
      </header>

      <div className="about__pin">
        <p className="about__statement" aria-label={STATEMENT}>
          {STATEMENT.split(" ").map((word, i) => (
            <span className="about__word" key={i} aria-hidden="true">
              {word}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="caps">
        <h3 className="caps__label mono" data-reveal>What I work with</h3>
        <div className="caps__grid">
          {CAPABILITIES.map(({ title, items }) => (
            <div className="caps__group" key={title} data-reveal>
              <h4 className="caps__title">{title}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
