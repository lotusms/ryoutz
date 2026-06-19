"use client";

import Link from "next/link";

const BASE_CLASSES =
  "inline-flex min-w-fit items-center justify-center gap-2 rounded-full border px-6 py-3.5 font-serif text-sm font-semibold capitalize tracking-wide transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const VARIANT_CLASSES =
  "border-amber-400/50 bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 text-amber-950 shadow-[0_10px_32px_-8px_rgba(245,158,11,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] ring-1 ring-white/15 hover:border-amber-300/60 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 hover:shadow-[0_16px_40px_-8px_rgba(245,158,11,0.48)] focus-visible:ring-amber-400/70";

export default function SecondaryButton({
  href,
  type = "button",
  icon = null,
  iconPosition = "left",
  className = "",
  children,
  ...props
}) {
  const hasIcon = Boolean(icon);
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES} ${className}`.trim();
  const content = (
    <>
      {icon && iconPosition === "left" ? icon : null}
      <span className={hasIcon ? "" : "text-center"}>{children}</span>
      {icon && iconPosition === "right" ? icon : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}
