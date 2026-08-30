import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Modal from "./Modal";

// Read at call time rather than module scope: module-level constants freeze the
// values at first import, which makes the unconfigured path impossible to test.
const getEmailConfig = () => {
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_SERVICE_ID;
  const templateId = import.meta.env.VITE_TEMPLATE_ID;
  return {
    publicKey,
    serviceId,
    templateId,
    isConfigured: Boolean(publicKey && serviceId && templateId),
  };
};

const EMAIL = "shivendrashukla06@gmail.com";
const EMPTY_FORM = { name: "", email: "", message: "" };

const DIRECT_LINKS = [
  { label: EMAIL, href: `mailto:${EMAIL}`, Icon: FaEnvelope },
  {
    label: "github.com/codemaster321",
    href: "https://github.com/codemaster321",
    Icon: FaGithub,
  },
  {
    label: "linkedin.com/in/shivendra-shukla",
    href: "https://www.linkedin.com/in/shivendra-shukla-a12306147/",
    Icon: FaLinkedin,
  },
];

const Contact = function Contact() {
  const refForm = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    const { isConfigured, publicKey } = getEmailConfig();
    if (isConfigured) emailjs.init({ publicKey });
  }, []);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    // Honeypot: a real person never fills a hidden field, but bots fill every
    // input they find. Pretend it worked so the bot doesn't retry.
    if (refForm.current?.elements.company?.value) {
      setFormData(EMPTY_FORM);
      setStatus("success");
      return;
    }

    const { isConfigured, serviceId, templateId } = getEmailConfig();

    if (!isConfigured) {
      console.error(
        "EmailJS is not configured — set VITE_PUBLIC_KEY, VITE_SERVICE_ID and VITE_TEMPLATE_ID."
      );
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      await emailjs.sendForm(serviceId, templateId, refForm.current);
      // Only clear and celebrate once the send actually resolved.
      setFormData(EMPTY_FORM);
      setStatus("success");
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus("error");
    }
  }

  const isSending = status === "sending";

  return (
    <footer className="contactSection section">
      {status === "success" && <Modal onClose={() => setStatus("idle")} />}
      {status === "error" && (
        <Modal
          variant="error"
          title="Message Not Sent"
          description={`Something went wrong sending your message. Please try again, or email me directly at ${EMAIL}.`}
          onClose={() => setStatus("idle")}
        />
      )}

      <div className="contact-layout">
        <div className="contact-intro">
          <span className="contact-eyebrow">Get in touch</span>
          <h2 className="contact-title">
            Let&apos;s build something <span className="highlight">good</span>.
          </h2>
          <p className="contact-lead">
            Got a project, a role, or just an idea worth arguing about? Send it
            over — I read everything and reply to most things within a day or
            two.
          </p>

          <ul className="contact-links">
            {DIRECT_LINKS.map(({ label, href, Icon }) => (
              <li key={href}>
                <a
                  className="contact-link"
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span className="contact-link__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="contact-link__label">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form ref={refForm} onSubmit={handleSubmit} className="contact-me">
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              className="name"
              type="text"
              name="name"
              placeholder="Ada Lovelace"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange("name")}
              disabled={isSending}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              className="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange("email")}
              disabled={isSending}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="6"
              placeholder="Tell me what you're building…"
              value={formData.message}
              onChange={handleChange("message")}
              disabled={isSending}
              required
            ></textarea>
          </div>

          {/* Hidden from users and assistive tech; only bots will fill it. */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button type="submit" className="show-modal" disabled={isSending}>
            {isSending ? "Sending…" : "Send message"}
            {!isSending && <span className="btn-icon">→</span>}
          </button>
        </form>
      </div>
    </footer>
  );
};

export default Contact;
