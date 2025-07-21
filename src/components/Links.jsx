import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Links() {
  return (
    <div className="footer-icons">
      <a
        href="https://github.com/codemaster321"
        target="_blank"
        rel="noreferrer"
        className="icon-link"
      >
        <FaGithub size={30} />
      </a>
      <a
        href="https://www.linkedin.com/in/shivendra-shukla-a12306147/"
        target="_blank"
        rel="noreferrer"
        className="icon-link"
      >
        <FaLinkedin size={30} />
      </a>
      <p className="footer-text">Made with ❤️ by Shivendra</p>
    </div>
  );
}
