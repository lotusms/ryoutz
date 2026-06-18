"use client";

import Link from "next/link";

const BASE_CLASSES =
  "inline-flex min-w-fit items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-amber-950 shadow-[0_10px_36px_-8px_rgba(180,83,9,0.45)] ring-2 ring-amber-200/55 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(217,119,6,0.5)] hover:ring-amber-100/70 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANT_CLASSES =
  "bg-linear-to-br from-yellow-50 via-amber-100 to-amber-400";

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
