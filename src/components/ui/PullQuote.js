import { orgName } from "@/config";

/**
 * Editorial pull quote — blue rule, neutral type (About + service pages).
 *
 * @param {{ quote: string; attribution?: string; className?: string }} props
 */
export default function PullQuote({
  quote,
  attribution = orgName,
  className = "",
}) {
  return (
    <blockquote
      className={`relative border-l-2 border-blue-400 pl-8 sm:pl-10 ${className}`.trim()}
    >
      <p className="font-serif text-xl italic leading-relaxed text-neutral-200/90 lg:leading-snug">
        {quote}
      </p>
      <footer className="mt-5 text-xs uppercase tracking-[0.28em] text-neutral-200/90">
        — {attribution}
      </footer>
    </blockquote>
  );
}
