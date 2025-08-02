import { Link } from "react-router-dom";

function Project({ project, link, description, skillset, category }) {
  return (
    <div className="project-card">
      <div className="project--image">
        <img src="https://picsum.photos/1000/1000" alt="image" />
        <div className="project--overlay">
          <Link to={link} className="project--link">
            View Project
          </Link>
        </div>
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
//
