export default function Skill({ skill }) {
  return (
    <div className="skill">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5" // Change "stroke-width" to "strokeWidth"
        stroke="currentColor"
        className="skillIcon"
      >
        <path
          strokeLinecap="round" // Change "stroke-linecap" to "strokeLinecap"
          strokeLinejoin="round" // Change "stroke-linejoin" to "strokeLinejoin"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
      {skill}
    </div>
  );
}
