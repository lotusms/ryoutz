"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import PullQuote from "@/components/ui/PullQuote";
import SecondaryButton from "@/components/ui/SecondaryButton";

/**
 * Shared layout for every page under `/services/*`.
 *
 * @param {{
 *   lead: string[];
 *   inclusions: { title?: string; items: string[] };
 *   process: { title?: string; steps: { title: string; body: string }[] };
 *   pullQuote?: string;
 *   cta: {
 *     primaryHref: string;
 *     primaryLabel: string;
 *     secondaryHref?: string;
 *     secondaryLabel?: string;
 *   };
 * }} props
 */
export default function ServicePageBody({
  lead,
  inclusions,
  process,
  pullQuote,
  cta,
}) {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      {lead.length > 0 ? (
        <section className="max-w-3xl space-y-5">
          {lead.map((paragraph, i) => (
            <p
              key={i}
              className={`text-base leading-8 text-neutral-200/90 ${i === 0 ? "text-neutral-100/95" : ""}`}
            >
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}

      <section>
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-blue-300/90">
          {inclusions.title ?? "What's included"}
        </p>
        <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {inclusions.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 border-t border-white/10 pt-5"
            >
              <span
                aria-hidden
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/70 shadow-[0_0_8px] shadow-blue-500/35"
              />
              <span className="text-sm leading-7 text-neutral-200/90">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-blue-300/90">
          {process.title ?? "How it works"}
        </p>
        <ol className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {process.steps.map((step, i) => (
            <li
              key={step.title}
              className="border-t border-white/10 pt-6"
            >
              <p className="font-mono text-xs tabular-nums tracking-[0.3em] text-blue-300/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-lg font-bold tracking-[-0.02em] text-blue-400">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-200/90">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {pullQuote ? <PullQuote quote={pullQuote} /> : null}

      <section className="flex flex-col items-start gap-6 border-t border-white/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-blue-300/90">
            Next step
          </p>
          <p className="mt-3 font-serif text-2xl font-bold tracking-[-0.02em] text-blue-400">
            Tell us about your pavement.
          </p>
          <p className="mt-3 text-sm leading-7 text-neutral-200/90">
            Share your property address, surface type, and what you need done —
            we will follow up with a clear scope and estimate, usually within one
            business day.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton href={cta.primaryHref}>{cta.primaryLabel}</PrimaryButton>
          {cta.secondaryHref && cta.secondaryLabel ? (
            <SecondaryButton href={cta.secondaryHref}>
              {cta.secondaryLabel}
            </SecondaryButton>
          ) : null}
        </div>
      </section>
    </div>
  );
}
