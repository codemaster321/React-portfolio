import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ICONS = {
  success: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  error: "M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const Modal = ({
  onClose,
  variant = "success",
  title = "Message Sent Successfully!",
  description = "Thank you for reaching out. I'll get back to you as soon as possible.",
}) => {
  const closeRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    // Move focus into the dialog so keyboard users land on the close control.
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${variant}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button onClick={onClose} className="close-modal" aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="close-icon"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="modal-content">
          <div className="modal-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="success-icon"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICONS[variant] ?? ICONS.success}
              />
            </svg>
          </div>

          <h2 className="modal-title" id="modal-title">
            {title}
          </h2>
          <p className="modal-description">{description}</p>

          <button ref={closeRef} onClick={onClose} className="modal-button">
            Got it!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
