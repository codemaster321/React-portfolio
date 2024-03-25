import Skill from "./Skill";

export default function Skills() {
  const skills = ["Javascript", "Node.js", "HTML", "CSS", "Python", "React.js"];
  return (
    <>
      <section className="section--skills section">
        <div className="skills">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="skill--icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>

            <h1 className="heading">Skills</h1>
          </div>
          <div className="skills-list">
            {skills.map((skill) => (
              <Skill skill={skill} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
