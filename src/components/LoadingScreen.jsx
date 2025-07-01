import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import App from "../App";
import gsap from "gsap";
import { div } from "three/examples/jsm/nodes/Nodes.js";
import { useRef } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const comp = useRef();
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return prev + Math.floor(Math.random() * 10) + 1;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
      });

      tl.to(".loadingScreen", {
        duration: 1.5,
        opacity: 0,
        delay: 0, // Delay before timeline starts
      });

      tl.to(".bar", {
        duration: 1,
        height: 0,
        stagger: {
          amount: 0.5,
        },
        onComplete: () => {
          if (comp.current) {
            comp.current.style.pointerEvents = "none";
          }
        },
      });
    }
  }, [loading]);
  return (
    <>
      <div ref={comp} className="overlay-loading">
        <div className="bar"></div>
        <div className="bar"></div>

        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <p
        className="loadingScreen"
        style={{ fontSize: "8rem", marginTop: "1rem", zIndex: 1000 }}
      >
        {progress}
      </p>
    </>
  );
}
