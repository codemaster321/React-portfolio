import { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ onClose }) => {
  useEffect(() => {}, [onClose]);
  return createPortal(
    <>
      <div class="modal ">
        <button onClick={onClose} class="close-modal">
          &times;
        </button>
        <h1>Email Sent</h1>
      </div>
      <div class="overlay--contact "></div>
    </>,
    document.querySelector("footer")
  );
};
export default Modal;
