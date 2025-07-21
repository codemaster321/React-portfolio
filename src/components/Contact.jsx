import { useRef, useState, useLayoutEffect } from "react";

import React from "react";
import MapView from "./MapView";
import Modal from "./Modal";
import { Form } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Contact = function Contact(props) {
  const refMap = useRef(null);
  const refForm = useRef(null);

  useLayoutEffect(() => {
    emailjs.init({ publicKey: import.meta.env.VITE_PUBLIC_KEY });
    gsap.registerPlugin(ScrollTrigger);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".contactSection",
        start: "top-=100 50%", // when the top of the trigger hits the top of the viewport
        end: "+=400px", // end after scrolling 500px beyond the start
        scrub: 1,
      },
    });

    tl.from(refMap.current, { x: -100, opacity: 0 })
      .to(refMap.current, {
        x: 0,
        opacity: 1,
      })
      .from(refForm.current, { x: 100, opacity: 0 })
      .to(refForm.current, {
        x: 0,
        opacity: 1,
      });
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleChangeName(e) {
    setFormData({ ...formData, name: e.target.value });
  }

  function handleChangeEmail(e) {
    setFormData({ ...formData, email: e.target.value });
  }

  function handleChangeInput(e) {
    setFormData({ ...formData, message: e.target.value });
  }

  function handleSumbit(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        refForm.current
      )
      .then((result) => {
        console.log(result);
        console.log("SUCCESS!"),
          (error) => {
            console.log("FAILED...", error.text);
          };
      });
    setIsOpen(true);
    setFormData({ name: "", email: "", message: "" });
  }

  function onCloseHandler() {
    setIsOpen(false);
  }

  return (
    <footer class="contactSection section">
      {isOpen && <Modal onClose={onCloseHandler} />}
      <MapView ref={refMap} />
      <Form
        ref={refForm}
        onSubmit={handleSumbit}
        method="post"
        className="contact-me"
      >
        <h1>Contact Me</h1>
        <p>If you have anything in your mind, i will code it out for you</p>
        <span>Name</span>
        <input
          onChange={handleChangeName}
          class="name"
          type="text"
          name="name"
          id=""
          value={formData.name}
          required
        />
        <span>Email</span>
        <input
          onChange={handleChangeEmail}
          class="email"
          type="email"
          name="email"
          id=""
          value={formData.email}
          required
        />
        <span>Message</span>
        <textarea
          onChange={handleChangeInput}
          name="message"
          id=""
          cols="30"
          rows="10"
          value={formData.message}
        ></textarea>
        <button class="show-modal">Submit!!</button>
      </Form>
    </footer>
  );
};

export default Contact;
