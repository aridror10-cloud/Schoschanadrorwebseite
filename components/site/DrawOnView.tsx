"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Setzt einmal die Klasse "is-drawn", sobald gut die Haelfte des Elements
 * zu sehen ist (Zeichen auf "Ueber mich", 04.11.26). Ohne JavaScript bleibt
 * die fertige Zeichnung stehen, die Animation ist nur eine Zugabe.
 */
export function DrawOnView({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold: 0.6, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
