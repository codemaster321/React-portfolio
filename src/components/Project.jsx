import { Link } from "react-router-dom";

function Project({ project, title, link }) {
  return (
    <div className="card">
      <div className="card__side card__side--front">
        <div className="project--image">
          <img src="https://picsum.photos/1000/1000" alt="imagee" />
        </div>
        <div className="project--title">{project}</div>
      </div>

      <div className="card__side card__side--back">
        <div className="project--title__back">
          <Link to={link}>
            <div style={{ textDecoration: "underline" }}>Live site</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Project;
