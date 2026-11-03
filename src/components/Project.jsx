import HoverText from "./HoverText";
export default function Project({
  index,
  title,
  summary,
  category,
  image,
  link,
  stack,
  isActive,
  onActivate,
}) {
  return (
    <li
      className={`work__row${isActive ? " is-active" : ""}`}
      data-reveal
      onPointerEnter={onActivate}
    >
      <a
        className="work__link"
        href={link}
        target="_blank"
        rel="noreferrer"
        onFocus={onActivate}
      >
        <span className="work__num mono">{String(index + 1).padStart(2, "0")}</span>

        <span className="work__main">
          <span className="work__title"><HoverText text={title} /></span>
          <span className="work__summary">{summary}</span>
        </span>

        <span className="work__meta">
          <span className="work__category mono">{category}</span>
          <span className="work__stack mono">{stack.join(" · ")}</span>
        </span>

        <span className="work__arrow" aria-hidden="true">↗</span>

        {/* Touch screens have no cursor preview, so show the image inline. */}
        <span className="work__thumb">
          <img
            src={image.replace(".webp", "-640.webp")}
            srcSet={`${image.replace(".webp", "-640.webp")} 640w, ${image} 1280w`}
            sizes="(max-width: 900px) 92vw, 1px"
            width="1280"
            height="720"
            alt={`${title} landing page`}
            loading="lazy"
            decoding="async"
          />
        </span>
      </a>
    </li>
  );
}
