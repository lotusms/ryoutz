"use client";

import Link from "next/link";

/** Shared styles for uppercase blue “View” / text links (shop, hero). */
export const linkButtonClasses =
  "hidden shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/90 underline decoration-blue-400/50 underline-offset-4 transition hover:text-blue-200 hover:decoration-blue-300/70 sm:inline";

/** Light site themes — readable on pale scrims / cards. */
export const linkButtonClassesLight =
  "hidden shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-blue-900/95 underline decoration-blue-700/55 underline-offset-4 transition hover:text-blue-950 hover:decoration-blue-800/70 sm:inline";

export default function LinkButton({ href, children, className = "", ...props }) {
  return (
    <Link
      href={href}
      className={`${linkButtonClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </Link>
  );
}
