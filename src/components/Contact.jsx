import { useEffect, useRef, useState } from "react";

import ReactDOM from "react-dom";
import React from "react";
import MapView from "./MapView";
import Modal from "./Modal";
import { Form } from "react-router-dom";

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);

  const closeRef = useRef();

  function handleSumbit(e) {
    e.preventDefault();
    console.log("Submitted");
    setIsOpen(true);
  }

  function onCloseHandler() {
    setIsOpen(false);
  }

  return (
    <footer class="contactSection section">
      {isOpen && <Modal onClose={onCloseHandler} ref={closeRef} />}
      <MapView />
      <Form onSubmit={handleSumbit} method="post" className="contact-me">
        <h1>Contact Me</h1>
        <p>If you have anything in your mind, i will code it out for you</p>
        <span>Name</span>
        <input class="name" type="text" name="name" id="" required />
        <span>Email</span>
        <input class="email" type="email" name="email" id="" required />
        <span>Message</span>
        <textarea name="message" id="" cols="30" rows="10"></textarea>
        <button class="show-modal">Submit!!</button>
      </Form>
    </footer>
  );
}
