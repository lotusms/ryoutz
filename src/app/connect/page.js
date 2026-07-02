import Link from "next/link";

import RyoutzLogo from "@/components/brand/RyoutzLogo";
import {
  facebookPageUrl,
  googleReviewUrl,
  orgInquiryEmail,
  orgName,
  orgPhoneLabel,
  orgPhoneTel,
} from "@/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Connect",
  description: `Quick links to request an estimate, call, email, or follow ${orgName} on Facebook.`,
  path: "/connect",
});

const buttonBase =
  "flex min-h-[3.75rem] w-full items-center justify-center rounded-2xl border px-6 py-4 text-center font-serif text-base font-semibold tracking-wide transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:min-h-[4rem] sm:text-lg";

const primaryButton = `${buttonBase} border-blue-400/35 bg-linear-to-br from-[#0071f0] via-blue-600 to-blue-700 text-white shadow-[0_10px_32px_-8px_rgba(0,113,240,0.45)] hover:border-blue-300/50`;

const secondaryButton = `${buttonBase} border-amber-600/40 bg-amber-950/40 text-amber-50 hover:border-amber-500/50 hover:bg-amber-900/50`;

const mutedButton = `${buttonBase} border-white/10 bg-white/[0.04] text-neutral-100 hover:border-white/20 hover:bg-white/[0.07]`;

const disabledButton = `${buttonBase} cursor-not-allowed border-white/8 bg-white/[0.02] text-neutral-400`;

const phoneHref = orgPhoneTel?.trim()
  ? `tel:${orgPhoneTel.replace(/\s/g, "")}`
  : null;

export default function ConnectPage() {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] sm:px-8 sm:py-14">
      <div className="flex flex-col items-center text-center">
        <Link
          href="/"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          aria-label={`${orgName} — home`}
        >
          <RyoutzLogo
            className="h-24 w-auto max-w-[min(100%,18rem)] sm:h-28"
            title={orgName}
            neutralColor="#FFFFFF"
          />
        </Link>
        <p className="mt-4 text-sm leading-relaxed text-neutral-300/90">
          Tap a link below to get in touch or learn more.
        </p>
      </div>

      <nav
        aria-label="Quick connect links"
        className="mt-10 flex w-full flex-col gap-3 sm:mt-12 sm:gap-3.5"
      >
        <Link href="/contact" className={primaryButton}>
          Request a free estimate
        </Link>

        <Link href="/" className={secondaryButton}>
          Visit website
        </Link>

        <a
          href={facebookPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={mutedButton}
        >
          Facebook
        </a>

        {googleReviewUrl ? (
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={mutedButton}
          >
            Leave a Google review
          </a>
        ) : (
          <span className={disabledButton} aria-disabled="true">
            <span>
              Leave a Google review
              <span className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-neutral-500">
                Coming soon
              </span>
            </span>
          </span>
        )}

        {phoneHref ? (
          <a href={phoneHref} className={mutedButton}>
            Call {orgPhoneLabel}
          </a>
        ) : null}

        <a href={`mailto:${orgInquiryEmail}`} className={mutedButton}>
          Email {orgInquiryEmail}
        </a>
      </nav>

      <p className="mt-auto pt-10 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {orgName}
      </p>
    </main>
  );
}
