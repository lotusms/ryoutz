const TRACK = "text-xs uppercase tracking-[0.32em]";

/** Muted card titles on dark glass surfaces (see `Card` surface). */
const TITLE_BY_VARIANT = {
  default: `${TRACK} text-slate-400`,
  emerald: `${TRACK} text-emerald-400/90`,
  amber: `${TRACK} text-blue-300`,
  gradient: `${TRACK} text-slate-400`,
  inset: `${TRACK} text-blue-500`,
};

/**
 * @param {string} [variant]
 * @param {string} [_themeId] — ignored; site is dark-only
 */
export function cardTitleClassForVariant(variant, _themeId) {
  return TITLE_BY_VARIANT[variant] ?? TITLE_BY_VARIANT.default;
}
