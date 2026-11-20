import HoverText from "./HoverText";
import { useRef } from "react";
import { useReveal } from "../lib/motion";
import SkillsMap from "./SkillsMap";

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

export default function About({ onOpenProject }) {
  const root = useRef(null);
  useReveal(root);

  return (
    <section className="section about" id="about" ref={root}>
      <header className="section__head" data-reveal>
        <h2 className="section__title"><HoverText text="About" /></h2>
      </header>

      <div className="about__intro">
        <p className="about__statement">
          I like the hard middle of a product.
        </p>
        <p className="about__description">
          That&apos;s the stretch between a messy idea and something people actually use.
          I work Python-first, building FastAPI services, multi-agent systems and retrieval pipelines,
          then bringing them to users through React.
        </p>
      </div>

      <SkillsMap onOpenProject={onOpenProject} />
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
