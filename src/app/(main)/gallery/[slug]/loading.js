function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-amber-800/60 ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export default function Loading() {
  return (
    <main className="relative z-10 w-full">
      <article className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32 lg:px-12">
        <div
          className="relative w-full overflow-hidden rounded-sm bg-amber-900/60"
          style={{ aspectRatio: "3 / 4" }}
          aria-hidden="true"
        >
          <div className="h-full w-full animate-pulse bg-linear-to-br from-amber-800/60 via-amber-900/40 to-amber-800/60" />
        </div>

        <div className="mt-12 flex flex-col gap-6 sm:mt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="w-full max-w-2xl space-y-4">
            <SkeletonBlock className="h-3 w-32 rounded-full" />
            <SkeletonBlock className="h-12 w-3/4" />
            <SkeletonBlock className="h-12 w-1/2" />
          </div>
          <SkeletonBlock className="h-3 w-40 rounded-full lg:self-end" />
        </div>

        <div className="mt-14 max-w-3xl space-y-4">
          <SkeletonBlock className="h-5 w-full" />
          <SkeletonBlock className="h-5 w-[94%]" />
          <SkeletonBlock className="h-5 w-[88%]" />
          <SkeletonBlock className="h-5 w-[72%]" />
        </div>
      </article>
    </main>
  );
}
