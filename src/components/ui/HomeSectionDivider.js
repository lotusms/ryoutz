/** Centered blue rule between home page sections (use div — Tailwind preflight zeroes `<hr>` height). */
export default function HomeSectionDivider({ className = "" }) {
  return (
    <div
      aria-hidden
      role="presentation"
      className={`relative z-20 mx-auto block h-1 w-full max-w-5xl shrink-0 rounded-full bg-blue-400 ${className}`.trim()}
    />
  );
}
