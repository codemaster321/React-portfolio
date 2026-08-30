import Project from "./Project";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

const Portfolio = function Portfolio() {
  const refProject = useRef(null);

  const projects = [
    {
      id: 1,
      projectTitle: "ModelHub: Multi-Vertical Agentic Workflow Platform",
      description:
        "A no-code multi-agent platform running three production verticals on one engine: HR recruitment, a Hindi-first government scheme finder, and an FSSAI food safety checker. Drag-and-drop graph editor with streaming execution, RAG, and per-run cost tracking.",
      image: "/projects/modelhub.webp",
      link: "https://github.com/codemaster321/ai_modelhub",
      skillset: [
        "Python",
        "FastAPI",
        "CrewAI",
        "PostgreSQL",
        "pgvector",
        "RAG",
        "JWT Auth",
        "Docker",
      ],
      category: "AI / Agentic Platform",
    },
    {
      id: 2,
      projectTitle: "SleepLog: AI Sleep & Wellness Tracker",
      description:
        "A full-stack sleep platform with an AI sleep coach, journaling, health logs, goals, streaks, and trend visualisation — plus subscription billing with scheduled plan upgrades and downgrades.",
      image: "/projects/sleeplog.webp",
      link: "https://github.com/codemaster321/SleepTracker",
      skillset: [
        "Next.js 15",
        "React 19",
        "TypeScript",
        "Supabase",
        "Clerk",
        "Stripe",
        "LangChain",
        "Chart.js",
        "Tailwind CSS",
      ],
      category: "Full Stack / Health Tech",
    },
    {
      id: 3,
      projectTitle: "AI Vendor Procurement System",
      description:
        "An intelligent procurement platform that turns plain-English requirements into structured RFPs, emails them to vendors, parses unstructured replies over IMAP, and scores proposals on price, delivery, and warranty with an AI recommendation.",
      image: "/projects/procurement.webp",
      link: "https://github.com/codemaster321/AI-Vendor-Procurement-System",
      skillset: [
        "React",
        "Vite",
        "Node.js",
        "Express",
        "MongoDB",
        "OpenAI GPT-4o",
        "Nodemailer",
        "IMAP",
        "Tailwind CSS",
      ],
      category: "AI / Enterprise Automation",
    },
    {
      id: 4,
      projectTitle: "Charvaka Recovery",
      description:
        "A server-rendered marketing site for a mental health therapy practice, covering therapist profiles, mission and values, testimonials, FAQs, and enquiry contact flows.",
      image: "/projects/charvaka.webp",
      link: "https://charvaka-recovery.vercel.app/",
      skillset: [
        "React 19",
        "React Router v7",
        "SSR",
        "TypeScript",
        "Tailwind CSS v4",
        "Vite",
        "Docker",
      ],
      category: "Web / SSR Marketing Site",
    },
  ];

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Previously this selected ".util-box", which matches nothing in the
    // markup, so the cards never animated. Stagger the real cards instead.
    const ctx = gsap.context(() => {
      // immediateRender: false keeps the cards visible until the trigger
      // actually fires — a `from` tween would hide them on load and strand
      // them at opacity 0 if the trigger never fires.
      gsap.from(".project-card", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.18,
        immediateRender: false,
        scrollTrigger: {
          trigger: refProject.current,
          start: "top 90%",
          once: true,
        },
      });
    }, refProject);

    return () => ctx.revert();
  }, []);

  return (
    <section className="portfolioSection section">
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
            d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
          />
        </svg>
        <h2 className="heading">Past Projects</h2>
      </div>
      <div ref={refProject} className="portfolio">
        {projects.map((project) => {
          return (
            <Project
              key={project.id}
              project={project.projectTitle}
              description={project.description}
              skillset={project.skillset}
              category={project.category}
              image={project.image}
              link={project.link}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Portfolio;
