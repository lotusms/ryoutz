"use client";

import Link from "next/link";

import BeforeAfterCompare from "@/components/gallery/BeforeAfterCompare";
import ScrollSlideIn from "@/components/ui/ScrollSlideIn";
import SecondaryButton from "@/components/ui/SecondaryButton";

/**
 * @param {{ pairs: Array<Record<string, unknown>>; orgName: string }} props
 */
export default function BeforeAfterShowcase({ pairs, orgName }) {
  if (!Array.isArray(pairs) || pairs.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
          Before &amp; after
        </p>
        <p className="mt-4 text-base leading-8 text-neutral-200/90">
          Transformation photos are on the way. Check back soon or browse the
          full project gallery.
        </p>
        <SecondaryButton href="/gallery" className="mt-8">
          Back to gallery
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[min(100%,52rem)] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-[40%] h-72 w-72 rounded-full bg-amber-500/8 blur-3xl"
      />

      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-12">
        <ScrollSlideIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-serif font-bold uppercase tracking-[0.32em] text-blue-400">
            Real results
          </p>
          <h2 className="font-serif mt-4 text-3xl font-medium tracking-[-0.03em] text-neutral-100 sm:text-4xl">
            See the difference sealcoating makes
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-200/90">
            Side-by-side transformations from {orgName} — faded, cracked, and
            weather-worn pavement restored to a deep, even finish. Drag each
            slider on desktop or swipe on mobile.
          </p>
        </ScrollSlideIn>

        <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-20">
          {pairs.map((pair, i) => (
            <ScrollSlideIn
              key={pair.id}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={80}
            >
              <BeforeAfterCompare
                before={pair.before}
                after={pair.after}
                imageWidth={pair.imageWidth}
                imageHeight={pair.imageHeight}
                label={`Transformation ${pair.id}`}
                index={pair.id}
              />
            </ScrollSlideIn>
          ))}
        </div>

        <ScrollSlideIn delay={120} className="mt-16 flex flex-col items-center gap-4 sm:mt-20">
          <p className="max-w-lg text-center text-sm leading-7 text-neutral-200/80">
            Want results like these on your driveway or lot? We will walk the
            pavement with you and recommend what makes sense for your surface.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-blue-400/35 bg-linear-to-br from-[#0071f0] via-blue-600 to-blue-700 px-7 py-3.5 font-serif text-sm font-semibold capitalize tracking-wide text-white shadow-[0_10px_32px_-8px_rgba(0,113,240,0.48)] transition hover:-translate-y-0.5 hover:border-blue-300/50"
            >
              Get a free estimate
            </Link>
            <SecondaryButton href="/gallery">Back to gallery</SecondaryButton>
          </div>
        </ScrollSlideIn>
      </div>
    </div>
  );
}
