import HoverText from "./HoverText";
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
    <section className="section contact" id="contact">
      {status === "success" && <Modal onClose={() => setStatus("idle")} />}
      {status === "error" && (
        <Modal
          variant="error"
          title="Message Not Sent"
          description={`Something went wrong sending your message. Please try again, or email me directly at ${EMAIL}.`}
          onClose={() => setStatus("idle")}
        />
      )}

      <header className="section__head">
        <span className="section__index mono">(04)</span>
        <span className="section__title section__title--small">Contact</span>
      </header>

      <h2 className="contact__title">
        <HoverText text="Let's build something" />{" "}
        <em><HoverText text="worth shipping." /></em>
      </h2>

      <div className="contact__grid">
        <div className="contact__intro">
          <p className="contact__lead">
            Got a project, a role, or an idea worth arguing about? Send it over.
            I read everything and reply to most messages within a day or two.
          </p>

          <a className="contact__email" href={`mailto:${EMAIL}`}>
            {EMAIL}
            <span aria-hidden="true">↗</span>
          </a>

          <ul className="contact__links">
            {DIRECT_LINKS.slice(1).map(({ label, href, Icon }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noreferrer">
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form ref={refForm} onSubmit={handleSubmit} className="form">
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
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
              rows="5"
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

          <button type="submit" className="btn btn--solid form__submit" disabled={isSending}>
            {isSending ? "Sending…" : "Send message"}
            {!isSending && <span aria-hidden="true">→</span>}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
