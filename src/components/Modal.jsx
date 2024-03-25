import { createPortal } from "react-dom";

const Modal = ({ onClose }) => {
  return createPortal(
    <>
      <div class="modal ">
        <button onClick={onClose} class="close-modal">
          &times;
        </button>
        <h1>I will reach u back ASAP!!😍</h1>
      </div>
      <div class="overlay--contact "></div>
    </>,
    document.querySelector("footer")
  );
};
export default Modal;
