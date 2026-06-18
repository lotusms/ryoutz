"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Reveals its children with a scale + fade when they scroll into view.
 *
 * One-way by default — once revealed, stays in the at-rest state and the
 * IntersectionObserver disconnects to free its callback. Pass `replay` to
 * also reset to the off state when the element leaves the viewport (matches
 * the bidirectional feel of `ScrollSlideIn`).
 *
 * Honors `prefers-reduced-motion: reduce` by skipping the observer and
 * rendering the at-rest state immediately.
 *
 * @param {{
 *   delay?: number;
 *   threshold?: number;
 *   rootMargin?: string;
 *   replay?: boolean;
 *   as?: keyof JSX.IntrinsicElements;
 *   className?: string;
 *   children?: React.ReactNode;
 * } & React.HTMLAttributes<HTMLElement>} props
 */
export default function ScrollZoomIn({
  delay = 0,
  threshold = 0.15,
  rootMargin = "0px 0px -5% 0px",
  replay = false,
  as: Component = "div",
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (!replay) obs.disconnect();
        } else if (replay) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, replay, reduceMotion]);

  const visible = reduceMotion || revealed;

  return (
    <Component
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`origin-center transform-gpu transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}
