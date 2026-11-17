import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import "./ProcurementDemo.css";

const STAGES = ["Requirements", "RFP", "Vendor replies", "Recommendation"];
const EXAMPLE = {
  budget: "₹16,00,000",
  vendors: [
    { name: "Vendor A", price: "₹14,80,000", delivery: "10 days", fit: "Meets requirements" },
    { name: "Vendor B", price: "₹14,20,000", delivery: "21 days", fit: "Delivery outside target" },
  ],
};

export default function ProcurementDemo() {
  const [step, setStep] = useState(0);
  const root = useRef(null);
  const stageButtons = useRef([]);
  const previousProgress = useRef(0);
  const lenis = useLenis();

  useLayoutEffect(() => {
    let frame;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { lenis?.resize(); ScrollTrigger.refresh(); });
    };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    observer?.observe(root.current);
    refresh();
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); };
  }, [lenis]);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".proc-demo__item", { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: .4, stagger: .06, ease: "power3.out" });
      gsap.fromTo(".proc-demo__progress-fill", { scaleX: previousProgress.current },
        { scaleX: step / 3, duration: .5, ease: "power2.inOut" });
    }, root);
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".proc-demo__progress-fill", { scaleX: step / 3 });
    }, root);
    previousProgress.current = step / 3;
    return () => media.revert();
  }, [step]);

  const keyboardSelect = (event, i) => {
    let next;
    if (event.key === "ArrowRight") next = (i + 1) % STAGES.length;
    if (event.key === "ArrowLeft") next = (i + STAGES.length - 1) % STAGES.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = STAGES.length - 1;
    if (next === undefined) return;
    event.preventDefault(); setStep(next); stageButtons.current[next]?.focus();
  };

  return <div className="proc-demo" ref={root}>
    <div className="proc-demo__head">
      <div><p className="mono proc-demo__eyebrow">Workflow preview</p><h4>A requirement becomes a decision.</h4></div>
      <span className="mono proc-demo__badge">Illustrative demo</span>
    </div>
    <p className="proc-demo__disclaimer">Sample data to explain the workflow. No emails are sent or AI requests made.</p>
    <div className="proc-demo__stages" role="tablist" aria-label="Procurement workflow">
      {STAGES.map((label, i) => <button key={label} type="button" role="tab"
        ref={(el) => { stageButtons.current[i] = el; }} id={`proc-stage-${i}`}
        aria-selected={step === i} aria-controls="proc-demo-panel" tabIndex={step === i ? 0 : -1}
        onClick={() => setStep(i)} onKeyDown={(event) => keyboardSelect(event, i)}>
        <span className="mono">{i < step ? "✓" : `0${i + 1}`}</span>{label}
      </button>)}
    </div>
    <div className="proc-demo__progress" aria-hidden="true"><span className="proc-demo__progress-fill" /></div>
    <div id="proc-demo-panel" role="tabpanel" aria-labelledby={`proc-stage-${step}`} tabIndex={0} className="proc-demo__panel">
      {step === 0 && <div className="proc-demo__item">
        <span className="mono proc-demo__label">01 / The brief</span>
        <p className="proc-demo__statement">“We need 20 laptops for a new team. Each needs 16 GB RAM, within budget and delivered in two weeks.”</p>
        <p className="proc-demo__caption">Budget: {EXAMPLE.budget} · Delivery target: 14 days</p>
      </div>}
      {step === 1 && <div>
        <span className="mono proc-demo__label proc-demo__item">02 / Structured request for proposal</span>
        <dl className="proc-demo__rfp">
          {[['Equipment', '20 laptops'], ['Memory', '16 GB RAM per laptop'], ['Budget ceiling', EXAMPLE.budget], ['Delivery', 'Within 14 days']].map(([label, value]) =>
            <div key={label} className="proc-demo__item"><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </div>}
      {step === 2 && <div>
        <span className="mono proc-demo__label proc-demo__item">03 / Replies parsed into comparable fields</span>
        <div className="proc-demo__vendors">{EXAMPLE.vendors.map((vendor) => <div key={vendor.name} className="proc-demo__vendor proc-demo__item">
          <h5>{vendor.name}</h5><strong>{vendor.price}</strong><p>{vendor.delivery} delivery</p><span>{vendor.fit}</span>
        </div>)}</div>
      </div>}
      {step === 3 && <div className="proc-demo__item">
        <span className="mono proc-demo__label">04 / Suggested vendor</span>
        <p className="proc-demo__choice">Vendor A <span aria-hidden="true">↗</span></p>
        <p className="proc-demo__statement proc-demo__statement--small">Within budget. Meets the requested memory specification. Delivers in 10 days.</p>
        <p className="proc-demo__caption">Vendor B costs less, but its 21-day delivery misses the requirement. This example prioritizes meeting the deadline.</p>
      </div>}
    </div>
    <div className="proc-demo__controls">
      <span className="mono">0{step + 1} / 04</span>
      <div><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</button>
        <button type="button" className="proc-demo__next" onClick={() => setStep(step === 3 ? 0 : step + 1)}>{step === 3 ? "Replay" : "Next step"} <span aria-hidden="true">→</span></button></div>
    </div>
  </div>;
}
