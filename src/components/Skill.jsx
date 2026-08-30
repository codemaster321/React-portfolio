import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiShadcnui,
  SiHtml5,
  SiCss3,
  SiVite,
  SiChartdotjs,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiSupabase,
  SiClerk,
  SiStripe,
  SiJsonwebtokens,
  SiOpenai,
  SiLangchain,
  SiOllama,
  SiDocker,
  SiNginx,
  SiGit,
  SiGithubactions,
  SiVercel,
  SiCloudflare,
} from "react-icons/si";
import { LuWorkflow } from "react-icons/lu";
import { TbUsersGroup } from "react-icons/tb";

// Brand colours keep each logo recognisable against the dark cards; the tiles
// themselves stay in the site's emerald/GitHub-dark system.
//
// LangGraph and CrewAI have no Simple Icons brand mark, so they use neutral
// glyphs (a workflow graph and an agent crew) rather than an invented logo.
const SKILL_GROUPS = [
  {
    title: "Frontend",
    skills: [
      { name: "React", Icon: SiReact, color: "#61dafb" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#f0f6fc" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
      { name: "Tailwind", Icon: SiTailwindcss, color: "#38bdf8" },
      { name: "shadcn/ui", Icon: SiShadcnui, color: "#f0f6fc" },
      { name: "Chart.js", Icon: SiChartdotjs, color: "#ff6384" },
      { name: "HTML5", Icon: SiHtml5, color: "#e34f26" },
      { name: "CSS3", Icon: SiCss3, color: "#1572b6" },
      { name: "Vite", Icon: SiVite, color: "#a78bfa" },
    ],
  },
  {
    title: "Backend & Data",
    skills: [
      { name: "Node.js", Icon: SiNodedotjs, color: "#5fa04e" },
      { name: "Express", Icon: SiExpress, color: "#c9d1d9" },
      { name: "Python", Icon: SiPython, color: "#ffd43b" },
      { name: "FastAPI", Icon: SiFastapi, color: "#059669" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169e1" },
      { name: "MongoDB", Icon: SiMongodb, color: "#47a248" },
      { name: "Supabase", Icon: SiSupabase, color: "#3ecf8e" },
      { name: "Clerk", Icon: SiClerk, color: "#8b7bff" },
      { name: "JWT", Icon: SiJsonwebtokens, color: "#f0f6fc" },
      { name: "Stripe", Icon: SiStripe, color: "#8b7bff" },
    ],
  },
  {
    title: "AI & Agents",
    skills: [
      { name: "OpenAI", Icon: SiOpenai, color: "#f0f6fc" },
      { name: "LangChain", Icon: SiLangchain, color: "#6ee7b7" },
      { name: "LangGraph", Icon: LuWorkflow, color: "#34d399" },
      { name: "CrewAI", Icon: TbUsersGroup, color: "#f59e0b" },
      { name: "Ollama", Icon: SiOllama, color: "#f0f6fc" },
    ],
  },
  {
    title: "DevOps & Tooling",
    skills: [
      { name: "Docker", Icon: SiDocker, color: "#2496ed" },
      { name: "Nginx", Icon: SiNginx, color: "#009639" },
      { name: "Git", Icon: SiGit, color: "#f05032" },
      { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088ff" },
      { name: "Vercel", Icon: SiVercel, color: "#f0f6fc" },
      { name: "Cloudflare", Icon: SiCloudflare, color: "#f38020" },
    ],
  },
];

const Skill = () => {
  return (
    <div className="skill-groups">
      {SKILL_GROUPS.map(({ title, skills }) => (
        <div className="skill-group" key={title}>
          <h3 className="skill-group__title">{title}</h3>

          <ul className="skills-list">
            {skills.map(({ name, Icon, color }) => (
              <li className="skill" key={name}>
                <span
                  className="skill__icon"
                  style={{ color }}
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                <span className="skill__name">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Skill;
