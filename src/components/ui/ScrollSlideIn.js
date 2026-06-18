"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Slides its children in from the left or right (with fade) when the element
 * scrolls into view, and slides them back out the same side when it leaves.
 *
 * Bidirectional by design — scrolling back up replays the entrance. Honors
 * `prefers-reduced-motion` by simply rendering the at-rest state with no
 * transform or transition.
 *
 * @param {{
 *   direction?: "left" | "right";
 *   delay?: number;             // ms; applied only while sliding IN
 *   threshold?: number;         // IntersectionObserver threshold (0–1)
 *   rootMargin?: string;        // IntersectionObserver rootMargin
 *   as?: keyof JSX.IntrinsicElements; // wrapper element tag
 *   className?: string;
 *   children?: React.ReactNode;
 * } & React.HTMLAttributes<HTMLElement>} props
 */
export default function ScrollSlideIn({
  direction = "left",
  delay = 0,
  threshold = 0.15,
  rootMargin = "0px 0px -5% 0px",
  as: Component = "div",
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [intersecting, setIntersecting] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const obs = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, reduceMotion]);

  const visible = reduceMotion || intersecting;

  const offClass =
    direction === "right"
      ? "translate-x-16 opacity-0"
      : "-translate-x-16 opacity-0";
  const onClass = "translate-x-0 opacity-100";

  return (
    <Component
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transform-gpu transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        visible ? onClass : offClass
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}
