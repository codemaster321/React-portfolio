import { Fragment } from "react";

const Project = function Project({ project, title }) {
  return (
    <Fragment>
      <div className="util-box">
        <div className="header__main-text">
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
