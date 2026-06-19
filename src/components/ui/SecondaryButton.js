"use client";

import Link from "next/link";

const BASE_CLASSES =
  "inline-flex min-w-fit items-center justify-center gap-2 rounded-full border px-6 py-3.5 font-serif text-sm font-semibold capitalize tracking-wide transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const VARIANT_CLASSES =
  "border-2 border-amber-500/75 bg-transparent text-amber-400 shadow-none hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-300 focus-visible:ring-amber-500/60";

export default function SecondaryButton({
  href,
  type = "button",
  icon = null,
  iconPosition = "left",
  showChevron = false,
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
      {showChevron ? (
        <span aria-hidden className="text-base leading-none">
          ›
        </span>
      ) : null}
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
