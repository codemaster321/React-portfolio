import { Fragment, useRef } from "react";

const Project = function Project({ project, title }) {
  const ProjectRef = useRef(null);

  const handleClick = () => {
    ProjectRef.current.classList.toggle("click");
  };

  return (
    <Fragment>
      <div className="util-box">
        <div
          ref={ProjectRef}
          onClick={handleClick}
          className="header__main-text"
        >
          <h1>{title}</h1>
        </div>

        <div className="header__main-long_text">
          <h1>{project}</h1>
        </div>
      </div>
    </Fragment>
  );
};

export default Project;
