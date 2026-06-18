"use client";

import Link from "next/link";

const BASE_CLASSES =
  "inline-flex min-w-fit items-center justify-center gap-2 rounded-full border-2 border-amber-400/45 bg-stone-950/55 px-6 py-3.5 text-sm font-semibold text-amber-50 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.65)] ring-1 ring-amber-300/15 backdrop-blur-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-amber-300/70 hover:bg-amber-950/45 hover:text-amber-50 hover:shadow-[0_14px_40px_-12px_rgba(251,191,36,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/55 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";

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
  const classes = `${BASE_CLASSES} ${className}`.trim();
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
