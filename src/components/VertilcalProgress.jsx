import { useEffect } from "react";

export default function VerticalProgress() {
  useEffect(() => {
    const progressBar = document.getElementById("progressbar");
    if (!progressBar) return; // Ensure element exists
    const updateProgressBar = () => {
      const scroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      let scrolled = (scroll / height) * 100;
      if (scrolled <= 1) {
        progressBar.style.height = "1%";
      } else if (scrolled >= 2 && scrolled <= 99.9) {
        progressBar.style.height = scrolled + "%";
        progressBar.classList.remove("glow");
      } else if (scrolled === 100) {
        progressBar.style.height = scrolled + "%";
        progressBar.classList.add("glow");
      }
    };
    // Set initial height
    progressBar.style.height = "1%";
    // Attach scroll event listener
    window.addEventListener("scroll", updateProgressBar);
    // Cleanup function
    return () => {
      window.removeEventListener("scroll", updateProgressBar);
    };
  }, []);
  return (
    <div className="progress-container">
      <div id="progressbar" className="progress-bar"></div>
    </div>
  );
}
