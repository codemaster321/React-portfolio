import { useEffect, useRef } from "react";

export default function VerticalProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = null;

    const update = () => {
      frame = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const percent =
        scrollable > 0 ? Math.min((doc.scrollTop / scrollable) * 100, 100) : 0;
      bar.style.height = `${percent}%`;
    };

    // Coalesce scroll events into one write per frame.
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="progress-container" aria-hidden="true">
      <div ref={barRef} id="progressbar" className="progress-bar"></div>
    </div>
  );
}
