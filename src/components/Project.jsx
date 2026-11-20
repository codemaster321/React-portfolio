import HoverText from "./HoverText";
import { lazy, Suspense } from "react";

const ProcurementDemo = lazy(() => import("./ProcurementDemo"));

export default function Project({
  id,
  title,
  summary,
  category,
  image,
  link,
  stack,
  details,
  isOpen,
  onToggle,
}) {
  return (
    <li
      id={`project-${id}`}
      className={`work__row${isOpen ? " work__row--open" : ""}`}
      onKeyDown={(event) => {
        if (isOpen && event.key === "Escape") {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <article className="work__card">
        <button
          type="button"
          className="work__link"
          aria-expanded={isOpen}
          aria-controls={`case-study-${id}`}
          aria-label={`${isOpen ? "Close" : "Read"} ${title} case study`}
          onClick={onToggle}
        >
          <span className="work__thumb">
            <img
              src={image.replace(".webp", "-640.webp")}
              srcSet={`${image.replace(".webp", "-640.webp")} 640w, ${image} 1280w`}
              sizes="(max-width: 720px) 90vw, (max-width: 1500px) 45vw, 650px"
              width="1280"
              height="720"
              alt={`${title} landing page`}
              loading="lazy"
              decoding="async"
            />
          </span>
          <span className="work__main">
            <span className="work__category mono">{category}</span>
            <span className="work__title"><HoverText text={title} /></span>
            <span className="work__summary">{summary}</span>
            <span className="work__stack mono">{stack.join(" · ")}</span>
          </span>
          <span className="work__action">
            <span className="work__case-label">{isOpen ? "Close case study" : "Read case study"}</span>
            <span className="work__arrow" aria-hidden="true">{isOpen ? "−" : "↗"}</span>
          </span>
        </button>

        <div
          id={`case-study-${id}`}
          className="project-details"
          role="region"
          aria-labelledby={`case-title-${id}`}
          hidden={!isOpen}
        >
          <div className="project-details__head">
            <div>
              <p className="mono project-details__eyebrow">Behind the build</p>
              <h3 id={`case-title-${id}`} tabIndex={-1} aria-label={`${title} / Case study`}>
                Case study
              </h3>
            </div>
            <p className="project-details__role"><span className="mono">My role</span>End-to-end design &amp; development</p>
          </div>
          <dl className="project-details__grid">
            <div><dt>The problem</dt><dd>{details.problem}</dd></div>
            <div><dt>The approach</dt><dd>{details.approach}</dd></div>
            <div><dt>What shipped</dt><dd>{details.delivered}</dd></div>
          </dl>
          {id === "procurement" && isOpen && <Suspense fallback={<div className="project-demo-loading">Loading workflow preview…</div>}>
            <ProcurementDemo />
          </Suspense>}
          <div className="project-details__foot">
            <a className="btn btn--solid" href={link} target="_blank" rel="noreferrer">
              {link.startsWith("https://github.com/") ? "View repository" : "Visit live site"}
              <span aria-hidden="true">↗</span>
            </a>
            <button type="button" className="project-details__close mono" onClick={onToggle}>
              Close case study <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}
