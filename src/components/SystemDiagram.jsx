import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { FiArrowDownLeft, FiCpu, FiDatabase, FiMessageSquare, FiPause, FiPlay, FiRotateCcw } from "react-icons/fi";
import "./SystemDiagram.css";

gsap.registerPlugin(DrawSVGPlugin);

// The rail follows the centers of the 44px steps, spaced 12px apart.
const STEP_CENTERS = [22, 78, 134, 190];

const STAGES = [
  { name: "Request", tag: "Understand the task", Icon: FiArrowDownLeft,
    detail: "Start with a clear question, the user's intent, and the constraints the system needs to respect." },
  { name: "Retrieve", tag: "Find the context", Icon: FiDatabase,
    detail: "Bring relevant documents and data into context, so the answer has something concrete to draw on." },
  { name: "Reason", tag: "Coordinate the work", Icon: FiCpu,
    detail: "Break the task into steps and coordinate the tools and agents needed to carry it out." },
  { name: "Respond", tag: "Return something useful", Icon: FiMessageSquare,
    detail: "Turn the result into a clear response, with supporting context and a useful next step." },
];

export default function SystemDiagram({ ready }) {
  const root = useRef(null);
  const playback = useRef(null);
  const blockers = useRef(new Set());
  const detailId = useId();
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState(null);
  const [runningStage, setRunningStage] = useState(-1);
  const [paused, setPaused] = useState(false);
  const current = preview ?? selected;

  const blockPlayback = useCallback((reason, blocked) => {
    if (blocked) blockers.current.add(reason);
    else blockers.current.delete(reason);
    playback.current?.paused(blockers.current.size > 0);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const el = root.current;
      const nodes = Array.from(el.querySelectorAll(".system-flow__node"));
      const signals = el.querySelectorAll(".system-flow__pulse, .system-flow__halo");
      gsap.fromTo(nodes, { opacity: 0, x: 18 },
        { opacity: 1, x: 0, stagger: 0.09, duration: 0.7, delay: 0.2, ease: "power3.out" });
      gsap.fromTo(".system-flow__wire", { drawSVG: "0%" },
        { drawSVG: "100%", stagger: 0.12, duration: 0.7, delay: 0.4, ease: "power2.inOut" });

      const flow = gsap.timeline({ repeat: -1, repeatDelay: 1.8, delay: 1.1 });
      playback.current = flow;
      flow.set(".system-flow__energy", { scaleX: 0 })
        .set(signals, { attr: { cy: STEP_CENTERS[0] }, opacity: 1 });
      nodes.forEach((node, i) => {
        if (i) flow.to(signals, { attr: { cy: STEP_CENTERS[i] }, duration: 0.45, ease: "power2.inOut" });
        flow.call(() => setRunningStage(i))
          .fromTo(node.querySelector(".system-flow__icon"), { scale: 1, y: 0 },
            { scale: 1.16, y: -2, duration: 0.3, repeat: 1, yoyo: true, ease: "power2.inOut" })
          .to(node.querySelector(".system-flow__energy"), { scaleX: 1, duration: 0.95, ease: "none" }, "<");
      });
      flow.to(signals, { opacity: 0, duration: 0.35 })
        .call(() => setRunningStage(-1));

      const visibility = () => blockPlayback("hidden", document.hidden);
      document.addEventListener("visibilitychange", visibility);
      visibility();
      const observer = new IntersectionObserver(([entry]) => blockPlayback("offscreen", !entry.isIntersecting), { threshold: 0.15 });
      observer.observe(el);
      blockPlayback("hidden", document.hidden);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", visibility);
        playback.current = null;
      };
    }, root);
    media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const el = root.current;
      gsap.set(el, { transformPerspective: 1000 });
      const tiltX = gsap.quickTo(el, "rotationX", { duration: 0.65, ease: "power3.out" });
      const tiltY = gsap.quickTo(el, "rotationY", { duration: 0.65, ease: "power3.out" });
      const move = (event) => {
        const rect = el.getBoundingClientRect();
        const x = gsap.utils.clamp(0, 1, (event.clientX - rect.left) / rect.width);
        const y = gsap.utils.clamp(0, 1, (event.clientY - rect.top) / rect.height);
        tiltX((0.5 - y) * 4); tiltY((x - 0.5) * 4);
      };
      const reset = () => { tiltX(0); tiltY(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      };
    }, root);
    return () => media.revert();
  }, [ready, blockPlayback]);

  return (
    <aside className="system-flow" ref={root} aria-label="An agent workflow, explained">
      <div className="system-flow__header">
        <div>
          <h2>How an agent works</h2>
        </div>
        <div className="system-flow__controls">
          <button className="system-flow__replay" type="button" aria-label={paused ? "Resume workflow animation" : "Pause workflow animation"}
            onClick={() => { setPaused(!paused); blockPlayback("manual", !paused); }}>
            {paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
          </button>
          <button className="system-flow__replay" type="button" aria-label="Replay workflow animation"
            onClick={() => { setPaused(false); blockPlayback("manual", false); playback.current?.restart(); blockPlayback("hidden", document.hidden); }}>
            <FiRotateCcw aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="system-flow__body"
        onPointerEnter={(event) => { if (event.pointerType !== "touch") blockPlayback("hover", true); }}
        onPointerLeave={() => { setPreview(null); blockPlayback("hover", false); }}
        onFocus={() => blockPlayback("focus", true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) blockPlayback("focus", false); }}>
        <svg className="system-flow__rail" viewBox="0 0 28 212" aria-hidden="true">
          {STEP_CENTERS.slice(1).map((y, index) => (
            <path key={y} className="system-flow__wire" d={`M14 ${STEP_CENTERS[index]} V${y}`} />
          ))}
          {STEP_CENTERS.map((y) => <circle key={y} cx="14" cy={y} r="3" className="system-flow__point" />)}
          <circle cx="14" cy={STEP_CENTERS[0]} r="9" className="system-flow__halo" />
          <circle cx="14" cy={STEP_CENTERS[0]} r="4" className="system-flow__pulse" />
        </svg>
        <ol className="system-flow__nodes">
          {STAGES.map(({ name, tag, Icon }, i) => (
            <li className={`system-flow__node${runningStage === i ? " is-running" : ""}`} key={name}>
              <button type="button" className={`system-flow__step${current === i ? " is-current" : ""}`}
                aria-pressed={selected === i} aria-controls={detailId}
                aria-describedby={current === i ? detailId : undefined}
                onPointerEnter={(event) => { if (event.pointerType !== "touch") setPreview(i); }}
                onFocus={() => setPreview(i)} onBlur={() => setPreview(null)}
                onClick={() => { setSelected(i); setPreview(null); }}>
                <span className="system-flow__number mono">0{i + 1}</span>
                <Icon className="system-flow__icon" aria-hidden="true" />
                <span className="system-flow__label"><strong>{name}</strong><span>{tag}</span></span>
                <span className="system-flow__dot" aria-hidden="true" />
                <span className="system-flow__energy" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="system-flow__detail" id={detailId}>
        <span className="mono">0{current + 1} / {STAGES[current].name}</span>
        <p>{STAGES[current].detail}</p>
      </div>
      <div className="system-flow__footer mono">
        <span className="system-flow__hint">Explore each step</span>
        <span className="system-flow__status" aria-hidden="true"><i />{runningStage < 0 ? "Workflow preview" : `${String(runningStage + 1).padStart(2, "0")} / ${STAGES[runningStage].name}`}</span>
      </div>
    </aside>
  );
}
