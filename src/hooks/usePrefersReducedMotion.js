"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Safari < 14 used `addListener`; modern browsers use `addEventListener`.
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }
  mq.addListener(onChange);
  return () => mq.removeListener(onChange);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Tracks the user's `prefers-reduced-motion` setting reactively. Returns
 * `false` during SSR so animations render in their initial off state and
 * the post-mount snapshot decides whether to animate.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
