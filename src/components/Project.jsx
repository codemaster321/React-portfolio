function Project({ project, link, image, description, skillset, category }) {
  return (
    <div className="project-card">
      <div className="project--image">
        {/* The card renders ~370px wide, so 1x displays only need the 640w
            file; width/height keep the box reserved before the image lands. */}
        <img
          src={image}
          srcSet={`${image.replace(".webp", "-640.webp")} 640w, ${image} 1280w`}
          sizes="(max-width: 900px) 92vw, 400px"
          width="1280"
          height="720"
          alt={`${project} landing page`}
          loading="lazy"
          decoding="async"
        />
        {link && (
          <div className="project--overlay">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="project--link"
            >
              View Project
            </a>
          </div>
        )}
      </div>

      <div className="project--content">
        <div className="project--header">
          <div className="project--category">{category}</div>
          <h3 className="project--title">{project}</h3>
        </div>

        <div className="project--description">{description}</div>

        <div className="project--skills">
          <h4>Tech Stack:</h4>
          <div className="skills--grid">
            {skillset.map((skill, index) => (
              <span key={index} className="skill--tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
