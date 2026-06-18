"use client";

import { orgInquiryEmail } from "@/config";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

/**
 * @param {{ embedded?: boolean }} props — `embedded`: inside a parent card; lighter chrome.
 */
export default function ContactEmailCta({ embedded = false }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);

  const framed =
    light
      ? "group inline-flex max-w-full min-w-0 w-fit flex-col gap-1 rounded-2xl border-2 border-stone-300/55 bg-white/85 px-6 py-5 shadow-lg shadow-stone-400/20 transition hover:border-amber-400/45 hover:bg-amber-50/50"
      : "group inline-flex max-w-full min-w-0 w-fit flex-col gap-1 rounded-2xl border-2 border-stone-600/45 bg-stone-900/50 px-6 py-5 shadow-lg shadow-stone-950/35 transition hover:border-amber-400/35 hover:bg-stone-800/50";

  const soft =
    light
      ? "group inline-flex max-w-full min-w-0 flex-col gap-1 rounded-xl px-1 py-1 transition hover:bg-amber-500/10"
      : "group inline-flex max-w-full min-w-0 flex-col gap-1 rounded-xl px-1 py-1 transition hover:bg-white/[0.04]";

  return (
    <a
      href={`mailto:${orgInquiryEmail}`}
      className={embedded ? soft : framed}
    >
      <span
        className={
          light
            ? "text-xs uppercase tracking-[0.28em] text-stone-600"
            : "text-xs uppercase tracking-[0.28em] text-site-secondary"
        }
      >
        Write
      </span>
      <span
        className={
          light
            ? "font-serif text-2xl font-medium tracking-[-0.02em] text-stone-900 transition group-hover:text-sky-800 sm:text-3xl"
            : "font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg transition group-hover:text-site-primary sm:text-3xl"
        }
      >
        {orgInquiryEmail}
      </span>
      <span
        className={light ? "text-sm text-stone-600" : "text-sm text-site-secondary"}
      >
        Wedding inquiries, elopements, and portrait sessions.
      </span>
    </a>
  );
}
