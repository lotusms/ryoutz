/**
 * Adobe Fonts — Industry display family (Typekit kit `tbw7ovt`).
 * @see https://use.typekit.net/tbw7ovt.css
 */

export const ADOBE_FONTS_KIT_ID = "tbw7ovt";

export const ADOBE_FONTS_STYLESHEET_HREF =
  `https://use.typekit.net/${ADOBE_FONTS_KIT_ID}.css`;

/** CSS `font-family` stack from the published Typekit kit. */
export const INDUSTRY_FONT_FAMILY =
  '"industry", industry, ui-sans-serif, system-ui, sans-serif';

/** @returns {string} */
export function adobeFontsStylesheetHref() {
  const kitId =
    process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID?.trim() || ADOBE_FONTS_KIT_ID;
  return `https://use.typekit.net/${kitId}.css`;
}
