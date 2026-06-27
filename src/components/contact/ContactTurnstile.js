"use client";

import { Turnstile } from "@marsidev/react-turnstile";

/**
 * Cloudflare Turnstile for the contact form. Uses interaction-only mode so most
 * visitors never see the widget; it appears only when Cloudflare requires a check.
 *
 * @param {{
 *   onToken: (token: string) => void;
 *   onExpire?: () => void;
 *   onError?: () => void;
 * }} props
 */
export default function ContactTurnstile({ onToken, onExpire, onError }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!siteKey) return null;

  return (
    <div className="inline-block max-w-full origin-bottom-right scale-[0.92] opacity-75 transition-opacity hover:opacity-100 sm:scale-90">
      <Turnstile
        siteKey={siteKey}
        onSuccess={onToken}
        onExpire={() => onExpire?.()}
        onError={() => onError?.()}
        options={{
          theme: "dark",
          size: "compact",
          appearance: "interaction-only",
          action: "contact_inquiry",
        }}
      />
    </div>
  );
}
