import HoverText from "./HoverText";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Project from "./Project";
import { hasFinePointer, prefersReducedMotion, useReveal } from "../lib/motion";

const PROJECTS = [
  {
    id: "modelhub",
    title: "ModelHub",
    summary:
      "A no-code multi-agent platform running three production verticals on one engine: HR recruitment, a Hindi-first government scheme finder and an FSSAI food-safety checker.",
    category: "Agentic AI platform",
    image: "/projects/modelhub.webp",
    link: "https://github.com/codemaster321/ai_modelhub",
    stack: ["FastAPI", "CrewAI", "pgvector"],
  },
  {
    id: "sleeplog",
    title: "SleepLog",
    summary:
      "A sleep and wellness platform with an AI sleep coach, journaling, streaks and trend charts, plus Stripe billing with scheduled plan changes.",
    category: "Full-stack · Health",
    image: "/projects/sleeplog.webp",
    link: "https://github.com/codemaster321/SleepTracker",
    stack: ["Next.js 15", "Supabase", "LangChain"],
  },
  {
    id: "procurement",
    title: "Procurement AI",
    summary:
      "Turns plain-English requirements into RFPs, emails vendors, parses their unstructured replies over IMAP and scores proposals with an AI recommendation.",
    category: "Enterprise automation",
    image: "/projects/procurement.webp",
    link: "https://github.com/codemaster321/AI-Vendor-Procurement-System",
    stack: ["Node.js", "MongoDB", "GPT-4o"],
  },
  {
    id: "charvaka",
    title: "Charvaka Recovery",
    summary:
      "A server-rendered site for a mental-health therapy practice: therapist profiles, mission, testimonials, FAQs and enquiry flows.",
    category: "SSR marketing site",
    image: "/projects/charvaka.webp",
    link: "https://charvaka-recovery.vercel.app/",
    stack: ["React Router v7", "SSR", "Tailwind v4"],
  },
];

/**
 * Floating screenshot that trails the cursor over the list. All four images
 * sit in one vertical strip; hovering a row slides the strip to that image,
 * which reads as a single preview changing rather than four popping in.
 */
function CursorPreview({ listRef, activeIndex }) {
  const previewRef = useRef(null);
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion());

  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!enabled || !list || !preview) return;

    // Centre the preview on the cursor.
    gsap.set(preview, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onEnter = (e) => {
      gsap.set(preview, { x: e.clientX, y: e.clientY });
      gsap.to(preview, { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" });
    };
    const onLeave = () =>
      gsap.to(preview, { scale: 0.6, opacity: 0, duration: 0.4, ease: "power3.out" });

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerenter", onEnter);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerenter", onEnter);
      list.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, listRef]);

  if (!enabled) return null;

  return (
    <div ref={previewRef} className="preview" aria-hidden="true">
      <div
        className="preview__strip"
        style={{ transform: `translateY(${-Math.max(activeIndex, 0) * 100}%)` }}
      >
        {PROJECTS.map(({ id, image }) => (
          <img
            key={id}
            src={image.replace(".webp", "-640.webp")}
            alt=""
            width="640"
            height="360"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const root = useRef(null);
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  useReveal(root);

  return (
    <section className="section work" id="work" ref={root}>
      <header className="section__head" data-reveal>
        <span className="section__index mono">(01)</span>
        <h2 className="section__title">
          <HoverText text="Selected work" /><sup className="mono">{String(PROJECTS.length).padStart(2, "0")}</sup>
        </h2>
        <p className="section__aside">
          Products I&apos;ve designed, built and shipped end to end.
        </p>
      </header>

      <ol
        className={`work__list${activeIndex >= 0 ? " work__list--hovering" : ""}`}
        ref={listRef}
        onPointerLeave={() => setActiveIndex(-1)}
      >
        {PROJECTS.map((project, i) => (
          <Project
            key={project.id}
            index={i}
            {...project}
            isActive={activeIndex === i}
            onActivate={() => setActiveIndex(i)}
          />
        ))}
      </ol>

      <CursorPreview listRef={listRef} activeIndex={activeIndex} />
    </section>
  );
}
