"use client";

import Link from "next/link";

const BASE_CLASSES =
  "inline-flex min-w-fit items-center justify-center gap-2 rounded-full border px-6 py-3.5 font-serif text-sm font-semibold capitalize tracking-wide transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const VARIANT_CLASSES =
  "border-blue-400/35 bg-linear-to-br from-[#0071f0] via-blue-600 to-blue-700 text-white shadow-[0_10px_32px_-8px_rgba(0,113,240,0.48),inset_0_1px_0_0_rgba(255,255,255,0.14)] ring-1 ring-white/10 hover:border-blue-300/50 hover:from-blue-500 hover:via-[#0071f0] hover:to-blue-600 hover:shadow-[0_16px_40px_-8px_rgba(0,113,240,0.58)] focus-visible:ring-blue-500/70";

export default function PrimaryButton({
  href,
  type = "button",
  icon = null,
  iconPosition = "left",
  className = "",
  children,
  ...props
}) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES} ${className}`.trim();
  const content = (
    <>
      {icon && iconPosition === "left" ? icon : null}
      <span>{children}</span>
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
