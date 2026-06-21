import Link from "next/link";

/**
 * Centered CTA on the gallery page — routes to before/after transformations.
 */
export default function GalleryBeforeAfterCTA() {
  return (
    <div className="mx-auto flex justify-center px-6 pb-12 pt-2 sm:px-10 lg:px-12">
      <Link
        href="/gallery/before-after"
        className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-blue-400/30 bg-linear-to-r from-slate-900/90 via-slate-950 to-slate-900/90 px-2 py-2 pl-2 pr-6 shadow-[0_12px_40px_-12px_rgba(0,113,240,0.35)] ring-1 ring-white/5 transition duration-500 hover:-translate-y-0.5 hover:border-blue-300/45 hover:shadow-[0_18px_48px_-10px_rgba(0,113,240,0.45)] sm:pr-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(0,113,240,0.12) 50%, transparent 60%)",
          }}
        />
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#0071f0] to-blue-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] sm:h-12 sm:w-12">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="8" height="14" rx="1.5" />
            <rect x="13" y="5" width="8" height="14" rx="1.5" />
            <path d="M11 12h2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="relative text-left">
          <span className="block font-serif text-sm font-semibold capitalize tracking-wide text-neutral-100 sm:text-base">
            See before &amp; afters
          </span>
          <span className="mt-0.5 block text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
            Drag to compare transformations
          </span>
        </span>
        <span
          aria-hidden
          className="relative ml-1 text-lg text-blue-300/90 transition group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </div>
  );
}
