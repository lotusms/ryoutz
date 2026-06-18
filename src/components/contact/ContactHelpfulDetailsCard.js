"use client";

import Card from "@/components/ui/Card";
import { cardTitleClassForVariant } from "@/lib/cardTitle";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

/**
 * @param {{ lines: string[]; embedded?: boolean }} props — `embedded`: body only (no outer `Card`); for use inside `ContactInquiryPanel`.
 */
export default function ContactHelpfulDetailsCard({ lines, embedded = false }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const body = light ? "text-stone-800/95" : "text-site-fg/90";
  const footer = light ? "text-stone-600" : "text-site-secondary";
  const footerBorder = light ? "border-stone-300/50" : "border-site-fg/10";
  const titleClass = cardTitleClassForVariant("inset", themeId);
  const introMt = embedded ? "mt-5" : "mt-8";

  const listBlock = (
    <>
      <p className={`${introMt} text-sm leading-7 ${body}`}>
        A few details help me prepare a thoughtful reply for your wedding or elopement inquiry. The more you share now, the warmer the response will feel.
      </p>
      <ul className={`mt-5 space-y-4 text-sm leading-4 ${body}`}>
        {lines.map((line) => (
          <li key={line} className="flex gap-3">
            <span
              className={
                light
                  ? "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 shadow-[0_0_8px] shadow-amber-500/35"
                  : "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80 shadow-[0_0_10px] shadow-amber-400/40"
              }
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (embedded) {
    return (
      <>
        <h4 className={titleClass}>What to share in your note</h4>
        {listBlock}
      </>
    );
  }

  return (
    <Card
      variant="inset"
      title="What to share in your note"
      titleTag="h4"
      className="min-w-0 w-full"
    >
      {listBlock}
      <p
        className={`mt-8 border-t px-12 pt-6 text-center text-xs uppercase tracking-[0.22em] ${footerBorder} ${footer}`}
      >
        Only a handful of weddings each season, so early inquiries help.
      </p>
    </Card>
  );
}
