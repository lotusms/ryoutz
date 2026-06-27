"use client";

import { Turnstile } from "@marsidev/react-turnstile";

/**
 * Cloudflare Turnstile widget for the contact form. Hidden when site key is unset.
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
    <Turnstile
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={() => onExpire?.()}
      onError={() => onError?.()}
      options={{
        theme: "dark",
        size: "normal",
        action: "contact_inquiry",
      }}
    />
  );
}
