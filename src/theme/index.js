/**
 * Active visual theme — edit `CHOSEN_THEME` below (no UI toggle).
 * `./themes.css` — ids must match `THEME_IDS`.
 *
 * Dark palettes only: default | midnight | ember | noir-rose | velvet
 */

export const THEME_IDS = /** @type {const} */ ([
  "default",
  "midnight",
  "ember",
  "noir-rose",
  "velvet",
]);

/** Site is dark-only — kept for call-site compatibility. */
export const LIGHT_THEME_IDS = /** @type {const} */ ([]);

/** @param {string} [_id] */
export function isLightThemeId(_id) {
  return false;
}

/** @type {(typeof THEME_IDS)[number]} */
const CHOSEN_THEME = "default";

export const ACTIVE_THEME_ID = THEME_IDS.includes(CHOSEN_THEME)
  ? CHOSEN_THEME
  : "default";
