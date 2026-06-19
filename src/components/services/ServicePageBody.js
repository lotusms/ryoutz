"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

/**
 * Shared layout for every page under `/services/*`.
 *
 * Each service page renders this with its own data so the structure stays
 * consistent (lead → what's included → how it works → optional pull quote →
 * CTA). Theme-aware in the same way `AboutStudioCards` is — light/dark text
 * variants follow `html[data-theme]`.
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
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);

  const body = light ? "text-amber-800/95" : "text-amber-200/90";
  const leadTone = light ? "text-amber-700" : "text-amber-300/90";
  const heading = light ? "text-amber-900" : "text-amber-100";
  const muted = light ? "text-amber-600" : "text-amber-500";
  const label = light ? "text-blue-900/90" : "text-blue-300/90";
  const divider = light ? "border-amber-300/60" : "border-white/10";
  const accentBar = light ? "border-blue-600/40" : "border-blue-400/35";
  const stepNumber = light ? "text-blue-700/80" : "text-blue-300/70";

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      {lead.length > 0 ? (
        <section className="max-w-3xl space-y-5">
          {lead.map((paragraph, i) => (
            <p
              key={i}
              className={`text-base leading-8 ${i === 0 ? leadTone : body}`}
            >
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}

      <section>
        <p className={`text-xs font-medium uppercase tracking-[0.32em] ${label}`}>
          {inclusions.title ?? "What's included"}
        </p>
        <ul className={`mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2`}>
          {inclusions.items.map((item, i) => (
            <li
              key={i}
              className={`flex gap-4 border-t pt-5 ${divider}`}
            >
              <span
                aria-hidden
                className={`mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                  light ? "bg-blue-600/70" : "bg-blue-400/70"
                }`}
              />
              <span className={`text-sm leading-7 ${body}`}>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className={`text-xs font-medium uppercase tracking-[0.32em] ${label}`}>
          {process.title ?? "How it works"}
        </p>
        <ol className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {process.steps.map((step, i) => (
            <li
              key={step.title}
              className={`border-t pt-6 ${divider}`}
            >
              <p
                className={`font-mono text-xs tabular-nums tracking-[0.3em] ${stepNumber}`}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className={`mt-3 font-serif text-lg font-medium tracking-[-0.02em] ${heading}`}
              >
                {step.title}
              </h3>
              <p className={`mt-3 text-sm leading-7 ${body}`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {pullQuote ? (
        <blockquote className={`relative border-l-2 pl-8 sm:pl-10 ${accentBar}`}>
          <p
            className={`font-serif text-xl font-medium italic leading-relaxed sm:text-2xl lg:text-[1.55rem] lg:leading-snug ${heading}`}
          >
            {pullQuote}
          </p>
          <footer className={`mt-5 text-xs uppercase tracking-[0.28em] ${muted}`}>
            — RYoutz Asphalt Maintenance
          </footer>
        </blockquote>
      ) : null}

      <section
        className={`flex flex-col items-start gap-6 border-t pt-12 sm:flex-row sm:items-center sm:justify-between ${divider}`}
      >
        <div className="max-w-md">
          <p className={`text-xs font-medium uppercase tracking-[0.32em] ${label}`}>
            Next step
          </p>
          <p className={`mt-3 font-serif text-2xl font-medium tracking-[-0.02em] ${heading}`}>
            Tell me what you have in mind.
          </p>
          <p className={`mt-3 text-sm leading-7 ${body}`}>
            Every inquiry is read personally. Share the date, the place, and a
            sentence about how you want it to feel — I&apos;ll take it from
            there.
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
