import Link from "next/link";

/** Long editorial arrow line — desktop only. */
function ArrowLine({ direction = "right", className = "" }) {
  const dPath =
    direction === "right" ? "M0 6 L39 6" : "M40 6 L1 6";
  const dHead =
    direction === "right" ? "M34 1 L39 6 L34 11" : "M6 1 L1 6 L6 11";
  return (
    <svg
      viewBox="0 0 40 12"
      className={`h-2.5 w-10 shrink-0 ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dPath} />
      <path d={dHead} />
    </svg>
  );
}

/** Compact arrowhead — used on mobile so it doesn't crowd the title. */
function ArrowHead({ direction = "right", className = "" }) {
  const d =
    direction === "right"
      ? "M9 6 L15 12 L9 18"
      : "M15 6 L9 12 L15 18";
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3 w-3 shrink-0 ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/**
 * Quiet prev/next strip between gallery pieces.
 *
 * Mobile: prev and next sit side-by-side in a 2-column row so they read as a
 * pair, with `Index` as a small centered link below a hairline divider.
 *
 * Desktop (`sm+`): horizontal `prev | Index | next` strip with the long
 * editorial arrows.
 *
 * @param {{ prev?: { slug: string; title: string } | null; next?: { slug: string; title: string } | null }} props
 */
export default function GalleryPieceNav({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Browse gallery"
      className="mt-16 border-t border-white/10 pt-10 sm:mt-20 sm:pt-12"
    >
      {/* Mobile: side-by-side pair */}
      <div className="grid grid-cols-2 gap-4 sm:hidden">
        <div className="min-w-0">
          {prev ? (
            <Link
              href={`/gallery/${prev.slug}`}
              className="group block min-w-0 text-left text-amber-300/85 transition-colors hover:text-amber-50"
            >
              <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-amber-500">
                <ArrowHead
                  direction="left"
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
                <span>Previous</span>
              </span>
              <span className="mt-2 block truncate font-serif text-base tracking-[-0.01em]">
                {prev.title}
              </span>
            </Link>
          ) : null}
        </div>

        <div className="min-w-0 text-right">
          {next ? (
            <Link
              href={`/gallery/${next.slug}`}
              className="group block min-w-0 text-right text-amber-300/85 transition-colors hover:text-amber-50"
            >
              <span className="flex items-center justify-end gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-amber-500">
                <span>Next</span>
                <ArrowHead
                  direction="right"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
              <span className="mt-2 block truncate font-serif text-base tracking-[-0.01em]">
                {next.title}
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Mobile: Gallery link below, separated with a hairline */}
      <div className="mt-8 border-t border-white/6 pt-6 text-center sm:hidden">
        <Link
          href="/gallery"
          className="text-[11px] uppercase tracking-[0.34em] text-amber-400 transition-colors hover:text-blue-100"
        >
          Gallery
        </Link>
      </div>

      {/* Desktop layout */}
      <div className="hidden items-center justify-between gap-10 sm:flex">
        <div className="flex-1">
          {prev ? (
            <Link
              href={`/gallery/${prev.slug}`}
              className="group inline-flex max-w-full items-center gap-4 text-amber-300/85 transition-colors hover:text-amber-50"
            >
              <ArrowLine
                direction="left"
                className="transition-transform duration-500 ease-out group-hover:-translate-x-1.5"
              />
              <span className="min-w-0">
                <span className="block text-[10px] font-medium uppercase tracking-[0.34em] text-amber-500">
                  Previous
                </span>
                <span className="mt-1 block truncate font-serif text-lg tracking-[-0.01em]">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : null}
        </div>

        <Link
          href="/gallery"
          className="text-xs uppercase tracking-[0.32em] text-amber-400 transition-colors hover:text-blue-100"
        >
          Gallery
        </Link>

        <div className="flex-1 text-right">
          {next ? (
            <Link
              href={`/gallery/${next.slug}`}
              className="group inline-flex max-w-full items-center gap-4 text-amber-300/85 transition-colors hover:text-amber-50"
            >
              <span className="min-w-0 text-right">
                <span className="block text-[10px] font-medium uppercase tracking-[0.34em] text-amber-500">
                  Next
                </span>
                <span className="mt-1 block truncate font-serif text-lg tracking-[-0.01em]">
                  {next.title}
                </span>
              </span>
              <ArrowLine
                direction="right"
                className="transition-transform duration-500 ease-out group-hover:translate-x-1.5"
              />
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
