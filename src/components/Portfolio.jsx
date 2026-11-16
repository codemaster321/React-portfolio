import HoverText from "./HoverText";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Project from "./Project";
import { prefersReducedMotion, useReveal } from "../lib/motion";
import "./ProjectDetails.css";

gsap.registerPlugin(Flip, ScrollTrigger);

const PROJECTS = [
  {
    id: "modelhub",
    details: {
      problem: "Recruitment, scheme discovery and food-safety checks involve different tasks, but share a need for coordinated AI workflows.",
      approach: "A shared multi-agent engine built around FastAPI, CrewAI and pgvector, exposed through a no-code platform.",
      delivered: "Three production verticals: HR recruitment, a Hindi-first government scheme finder and an FSSAI food-safety checker."
    },
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
    details: {
      problem: "Sleep tracking is more useful when daily entries connect to longer-term patterns and practical guidance.",
      approach: "A full-stack product using Next.js, Supabase and LangChain, combining a sleep coach with tracking and subscription features.",
      delivered: "AI coaching, journaling, streaks and trend charts, with Stripe billing and scheduled plan changes."
    },
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
    details: {
      problem: "Vendor procurement involves turning requirements into RFPs, gathering replies and comparing proposals that arrive in inconsistent formats.",
      approach: "An automation workflow using Node.js, MongoDB and GPT-4o, connecting RFP generation, vendor email and IMAP reply parsing.",
      delivered: "A workflow from plain-English requirements to scored vendor proposals and an AI recommendation."
    },
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
    details: {
      problem: "A therapy practice needs a clear way to introduce its therapists, explain its services and help visitors make an enquiry.",
      approach: "A server-rendered marketing site built with React Router v7 and Tailwind v4, bringing the practice information and enquiry flows together.",
      delivered: "Therapist profiles, the practice mission, testimonials, FAQs and enquiry flows."
    },
    title: "Charvaka Recovery",
    summary:
      "A server-rendered site for a mental-health therapy practice: therapist profiles, mission, testimonials, FAQs and enquiry flows.",
    category: "SSR marketing site",
    image: "/projects/charvaka.webp",
    link: "https://charvaka-recovery.vercel.app/",
    stack: ["React Router v7", "SSR", "Tailwind v4"],
  },
];

export default function Portfolio({ projectRequest }) {
  const root = useRef(null);
  const listRef = useRef(null);
  const stackAnimations = useRef([]);
  const flipState = useRef(null);
  const animation = useRef(null);
  const anchor = useRef(null);
  const handledRequest = useRef(null);
  const [openId, setOpenId] = useState(null);
  const lenis = useLenis();
  useReveal(root, ".section__head");

  const refreshLayout = useCallback(() => {
    lenis?.resize();
    ScrollTrigger.refresh();
  }, [lenis]);

  const refreshAfterLayout = useCallback(() => {
    // React applies the expanded class and case-study height after this
    // layout effect. Refreshing immediately measures the old stack geometry,
    // which leaves the following cards with stale sticky trigger positions.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      });
    });
  }, [lenis]);

  const keepCardInPlace = useCallback((card, top) => {
    const delta = card.getBoundingClientRect().top - top;
    if (Math.abs(delta) < 1) return;
    const destination = window.scrollY + delta;
    if (lenis) lenis.scrollTo(destination, { immediate: true, force: true });
    else window.scrollTo({ top: destination, behavior: "instant" });
  }, [lenis]);

  useLayoutEffect(() => {
    const section = root.current;
    const cards = Array.from(listRef.current.children);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const enable = !reducedMotion.matches;
    section.classList.toggle("work--stacked", enable);
    if (enable) {
      stackAnimations.current = cards.slice(0, -1).map((card, index) => {
        const incoming = cards[index + 1];
        const tween = gsap.to(card.querySelector(".work__card"), {
          scale: 0.94, opacity: 0.72, y: -8, ease: "none",
          scrollTrigger: {
            trigger: incoming,
            start: () => `top ${Math.max(window.innerHeight * 0.78, 100 + (index + 1) * 12)}px`,
            end: () => `top ${Math.min(96, window.innerHeight * 0.12) + (index + 1) * 12}px`,
            scrub: true, invalidateOnRefresh: true, refreshPriority: 10 - index,
          },
        });
        return tween;
      });
    }
    const refresh = () => ScrollTrigger.refresh();
    reducedMotion.addEventListener("change", refresh);
    ScrollTrigger.refresh();
    return () => {
      reducedMotion.removeEventListener("change", refresh);
      stackAnimations.current.forEach((tween) => tween.scrollTrigger?.kill());
      stackAnimations.current = [];
      section.classList.remove("work--stacked");
    };
  }, []);

  const setStackPaused = useCallback((paused) => {
    stackAnimations.current.forEach((tween) => {
      if (paused) tween.scrollTrigger?.disable(false);
      else tween.scrollTrigger?.enable(false);
    });
  }, []);

  const toggleProject = useCallback((id) => {
    // Finish any interrupted transition before measuring the next state.
    animation.current?.progress(1);
    animation.current?.kill();
    const row = document.getElementById(`project-${id}`);
    const card = row.querySelector(".work__card");
    const top = Math.max(96, card.getBoundingClientRect().top);
    setStackPaused(true);
    lenis?.resize();
    keepCardInPlace(card, top);
    anchor.current = card;
    flipState.current = prefersReducedMotion() ? null : Flip.getState(card);
    setOpenId((current) => current === id ? null : id);
  }, [keepCardInPlace, lenis, setStackPaused]);

  useLayoutEffect(() => {
    if (!projectRequest || handledRequest.current === projectRequest) return;
    handledRequest.current = projectRequest;
    if (!PROJECTS.some(({ id }) => id === projectRequest.id)) return;
    if (openId !== projectRequest.id) toggleProject(projectRequest.id);
    else {
      const heading = document.getElementById(`case-title-${openId}`);
      heading?.focus({ preventScroll: true });
      if (heading) keepCardInPlace(heading, 112);
    }
  }, [projectRequest, openId, toggleProject, keepCardInPlace]);

  useLayoutEffect(() => {
    const card = anchor.current;
    if (!card) return;
    const finish = () => {
      if (!openId) {
        const top = card.getBoundingClientRect().top;
        setStackPaused(false);
        lenis?.resize();
        keepCardInPlace(card, top);
      }
      refreshLayout();
      refreshAfterLayout();
      // Focus belongs to the active transition, not individual cards: a card
      // closing later in DOM order must not steal focus from the newly open one.
      const focusTarget = openId
        ? card.querySelector(`#case-title-${openId}`)
        : card.querySelector(".work__link");
      focusTarget?.focus({ preventScroll: true });
      if (focusTarget) {
        const { top } = focusTarget.getBoundingClientRect();
        const previewSpace = Math.min(240, window.innerHeight * 0.4);
        if (top < 96 || top > window.innerHeight - previewSpace) {
          // Wait until Flip has settled before moving the viewport. Immediate
          // alignment also prevents a second scroll animation fighting Lenis.
          keepCardInPlace(focusTarget, 112);
        }
      }
    };
    const state = flipState.current;
    flipState.current = null;
    if (state && !prefersReducedMotion()) {
      animation.current = Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        scale: false,
        onComplete: finish,
      });
    } else finish();
    refreshLayout();
  }, [openId, setStackPaused, keepCardInPlace, lenis, refreshLayout, refreshAfterLayout]);

  return (
    <section className={`section work work--cards${openId ? " work--expanded" : ""}`} id="work" ref={root}>
      <header className="section__head" data-reveal>
        <span className="section__index mono">(01)</span>
        <h2 className="section__title">
          <HoverText text="Selected work" /><sup className="mono">{String(PROJECTS.length).padStart(2, "0")}</sup>
        </h2>
        <p className="section__aside">
          Products I&apos;ve designed, built and shipped end to end.
        </p>
      </header>

      <ol className="work__list" ref={listRef}>
        {PROJECTS.map((project, i) => (
          <Project
            key={project.id}
            index={i}
            {...project}
            isOpen={openId === project.id}
            onToggle={() => toggleProject(project.id)}
          />
        ))}
      </ol>
    </section>
  );
}
