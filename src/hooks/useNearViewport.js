import { useEffect, useState } from "react";

// Preserve real content and its height; defer only the animation setup.
export default function useNearViewport(ref, rootMargin = "400px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNear(true);
      observer.disconnect();
    }, { rootMargin });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin, near]);
  return near;
}
