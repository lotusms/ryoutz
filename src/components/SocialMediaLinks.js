"use client";

import { RiFacebookCircleLine } from "react-icons/ri";
import { facebookPageUrl } from "@/config";

const SOCIAL_LINKS = [
  {
    href: facebookPageUrl,
    label: "Facebook — R. Youtz Asphalt Maintenance",
    Icon: RiFacebookCircleLine,
  },
];

/**
 * @param {{ variant?: "footer" | "contact"; className?: string; showLabel?: boolean }} props
 */
export default function SocialMediaLinks({
  variant = "contact",
  className = "",
  showLabel = false,
}) {
  const isFooter = variant === "footer";

  const linkRing = isFooter
    ? "ring-white/10 hover:bg-white/[0.06] hover:ring-blue-400/25"
    : "ring-white/10 hover:bg-white/[0.06] hover:ring-blue-400/25";

  const iconClass = isFooter
    ? "h-6 w-6 text-slate-400 transition group-hover:text-blue-200/95"
    : "h-6 w-6 text-neutral-200/90 transition group-hover:text-blue-300";

  const labelClass = isFooter
    ? "text-xs font-medium uppercase tracking-[0.28em] text-slate-500"
    : "text-xs font-medium uppercase tracking-[0.28em] text-neutral-200/90";

  const block = (
    <ul
      className={`flex flex-wrap items-center gap-2 ${className}`.trim()}
      aria-label="Social media"
    >
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`group inline-flex rounded-full p-2.5 ring-1 transition ${linkRing}`}
          >
            <Icon className={iconClass} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );

  if (!showLabel) return block;

  return (
    <div className="space-y-2">
      <p className={labelClass}>Social</p>
      {block}
    </div>
  );
}
