"use client";

import { cardTitleClassForVariant } from "@/lib/cardTitle";

const BASE_CARD_CLASSES = "rounded-4xl border-2 p-8 text-site-fg";

const VARIANT_CLASSES = {
  default:
    "border-slate-700/40 bg-slate-900/45 shadow-lg shadow-slate-950/30 backdrop-blur",
  emerald: "border-emerald-500/25 bg-slate-900/50 shadow-lg shadow-slate-950/30",
  amber:
    "border-blue-600/25 bg-slate-900/45 shadow-lg shadow-slate-950/30 backdrop-blur",
  gradient:
    "border-slate-600/35 bg-linear-to-br from-slate-800/35 to-slate-950/50 ring-2 ring-slate-500/15 backdrop-blur-md",
  inset:
    "border-slate-700/40 bg-slate-900/50 shadow-inner shadow-slate-950/40 backdrop-blur-sm",
};

export default function Card({
  variant = "default",
  className = "",
  title,
  titleClassName = "",
  titleTag = "p",
  children,
  ...rest
}) {
  const TitleTag = titleTag;
  const cardClasses = `${BASE_CARD_CLASSES} ${
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default
  } ${className}`.trim();
  const headingClasses = `font-serif font-bold ${cardTitleClassForVariant(variant)} ${titleClassName}`.trim();

  return (
    <div className={cardClasses} data-card-surface="dark" {...rest}>
      {title ? <TitleTag className={headingClasses}>{title}</TitleTag> : null}
      {children}
    </div>
  );
}
