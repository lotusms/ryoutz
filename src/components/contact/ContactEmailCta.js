"use client";

import { orgInquiryEmail } from "@/config";
import { cardTitleClassForVariant } from "@/lib/cardTitle";

/**
 * @param {{ embedded?: boolean }} props — `embedded`: inside a parent card; lighter chrome.
 */
export default function ContactEmailCta({ embedded = false }) {
  const framed =
    "group inline-flex max-w-full min-w-0 w-fit flex-col gap-1 rounded-2xl border-2 border-amber-600/45 bg-amber-900/50 px-6 py-5 shadow-lg shadow-amber-950/35 transition hover:border-blue-400/35 hover:bg-amber-800/50";

  const soft =
    "group inline-flex max-w-full min-w-0 flex-col gap-1 rounded-xl px-1 py-1 transition hover:bg-white/[0.04]";

  return (
    <a
      href={`mailto:${orgInquiryEmail}`}
      className={embedded ? soft : framed}
    >
      <span className={`${cardTitleClassForVariant("inset")} font-serif font-bold`}>
        Write
      </span>
      <span className="font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg transition group-hover:text-site-primary sm:text-3xl">
        {orgInquiryEmail}
      </span>
      <span className="text-sm text-neutral-200/90">
        General estimates and scheduling — or choose Tyler or Rick in the form below.
      </span>
    </a>
  );
}
