/**
 * Layered gold-toned backdrop. Drops into any `relative overflow-hidden`
 * container and renders four absolutely-positioned, decorative layers:
 *
 *   1. Diagonal amber wash (base color field)
 *   2. Stacked radial blooms (warm highlights, deeper amber pockets)
 *   3. Faint diagonal stripe texture (linen / paper feel)
 *   4. Vertical veil (subtle top-light, bottom-richness)
 *
 * Foreground content should sit in a sibling element with `relative` so it
 * stacks above these `aria-hidden` decorations. Pair with dark text
 * (`text-stone-900`/`text-stone-950`) for contrast.
 *
 * @param {{ className?: string }} props
 * @param {string} [props.className] Extra classes appended to the wrapper
 *   (e.g. extend with `rounded-3xl` when used inside a card).
 */
export default function GoldSpectrumBackdrop({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-linear-to-br from-amber-100 via-amber-200/95 to-amber-400/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_15%_-10%,rgba(254,243,199,0.95),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_20%,rgba(251,191,36,0.35),transparent_50%),radial-gradient(ellipse_60%_45%_at_0%_100%,rgba(180,83,9,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.07] mix-blend-multiply bg-[repeating-linear-gradient(-28deg,transparent,transparent_12px,rgba(28,25,23,0.5)_12px,rgba(28,25,23,0.5)_13px)]" />
      <div className="absolute inset-0 bg-linear-to-t from-stone-900/6 via-transparent to-amber-50/40" />
    </div>
  );
}
