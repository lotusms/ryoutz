"use client";

import Card from "@/components/ui/Card";
import ContactEmailCta from "@/components/contact/ContactEmailCta";
import ContactHelpfulDetailsCard from "@/components/contact/ContactHelpfulDetailsCard";
import SocialMediaLinks from "@/components/SocialMediaLinks";

/**
 * Single inset card: write / social / reply (left) and “what to share” (right),
 * with a shared footer line — replaces the former two-column split of separate cards.
 *
 * @param {{ lines: string[] }} props
 */
export default function ContactInquiryPanel({ lines }) {
  return (
    <Card variant="inset" className="min-w-0 w-full">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-start lg:gap-12">
        <div className="min-w-0 space-y-6 border-b border-white/10 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
          <ContactEmailCta embedded />
          <SocialMediaLinks showLabel />
          <p className="text-sm leading-7 text-neutral-200/90">
            Typical reply:{" "}
            <span className="text-neutral-200/90">within 48 hours</span>. For urgent repairs,
            mention that in your message and we will prioritize your request.
          </p>
        </div>

        <div className="min-w-0 lg:pl-2">
          <ContactHelpfulDetailsCard lines={lines} embedded />
        </div>
      </div>

      <p className="mt-8 border-t border-site-fg/10 px-4 pt-6 text-center text-xs uppercase tracking-[0.22em] text-neutral-200/90 sm:px-12">
        Spring and fall book quickly — reach out early for your preferred window.
      </p>
    </Card>
  );
}
