import { createPortal } from "react-dom";

const Modal = ({ onClose }) => {
  return createPortal(
    <>
      <div class="modal ">
        <button onClick={onClose} class="close-modal">
          &times;
        </button>
        <h1>Contact form will be implemented soon!!</h1>
      </div>
      <div class="overlay--contact "></div>
    </>,
    document.querySelector("footer")
  );
};
export default Modal;
