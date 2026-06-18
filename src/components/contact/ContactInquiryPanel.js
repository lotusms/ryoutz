"use client";

import Card from "@/components/ui/Card";
import ContactEmailCta from "@/components/contact/ContactEmailCta";
import ContactHelpfulDetailsCard from "@/components/contact/ContactHelpfulDetailsCard";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

/**
 * Single inset card: write / social / reply (left) and “what to share” (right),
 * with a shared footer line — replaces the former two-column split of separate cards.
 *
 * @param {{ lines: string[] }} props
 */
export default function ContactInquiryPanel({ lines }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);

  const sep = light ? "border-stone-300/50" : "border-white/10";
  const reply = light ? "text-stone-600" : "text-stone-400";
  const replyEm = light ? "text-stone-800" : "text-stone-300";
  const footer = light ? "text-stone-600" : "text-site-secondary";
  const footerBorder = light ? "border-stone-300/50" : "border-site-fg/10";

  return (
    <Card variant="inset" className="min-w-0 w-full">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-start lg:gap-12">
        <div
          className={`min-w-0 space-y-6 border-b pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10 ${sep}`}
        >
          <ContactEmailCta embedded />
          <SocialMediaLinks showLabel />
          <p className={`text-sm leading-7 ${reply}`}>
            Typical reply:{" "}
            <span className={replyEm}>within 1–2 business days</span>. If your date is
            close, mention it in the subject line and I will move you to the top.
          </p>
        </div>

        <div className="min-w-0 lg:pl-2">
          <ContactHelpfulDetailsCard lines={lines} embedded />
        </div>
      </div>

      <p
        className={`mt-8 border-t px-4 pt-6 text-center text-xs uppercase tracking-[0.22em] sm:px-12 ${footerBorder} ${footer}`}
      >
        Only a handful of weddings each season, so early inquiries help.
      </p>
    </Card>
  );
}
