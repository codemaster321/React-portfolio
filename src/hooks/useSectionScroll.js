import { useCallback } from "react";
import { useLenis } from "lenis/react";

/**
 * Scrolls to a section by selector.
 *
 * Native scrollIntoView fights Lenis for control of the scroll position, so we
 * hand the request to the Lenis instance when it exists and only fall back to
 * the native behaviour before Lenis has mounted.
 */
export default function useSectionScroll(offset = -70) {
  const lenis = useLenis();

  return useCallback(
    (selector) => {
      const target = document.querySelector(selector);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis, offset]
  );
}
