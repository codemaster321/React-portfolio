import HoverText from "./HoverText";
import { useEffect, useState } from "react";
import useSectionScroll from "../hooks/useSectionScroll";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/codemaster321" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shivendra-shukla-a12306147/" },
  { label: "Email", href: "mailto:shivendrashukla06@gmail.com" },
];

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

function useIndiaTime() {
  const [time, setTime] = useState(() => timeFormat.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(timeFormat.format(new Date())), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Footer() {
  const time = useIndiaTime();
  const scrollToSection = useSectionScroll(0);

  return (
    <footer className="footer">
      <div className="footer__row">
        <span className="mono">
          Local time — {time} IST
        </span>

        <ul className="footer__socials">
          {SOCIALS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="mono"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button type="button" className="footer__top mono" onClick={() => scrollToSection("#top")}>
          Back to top ↑
        </button>
      </div>

      <p className="footer__word" aria-hidden="true"><HoverText text="Shivendra" /></p>

      <div className="footer__row footer__row--legal mono">
        <span>© {new Date().getFullYear()} Shivendra Shukla</span>
        <span>Designed &amp; built by me</span>
      </div>
    </footer>
  );
}
