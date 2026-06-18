import { useEffect, useRef } from "react";

/**
 * Adds an `is-revealed` class to the element when it scrolls into view.
 * Pair with the `.reveal` utility in index.css for a soft fade+rise effect.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
