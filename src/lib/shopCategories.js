/** Shop catalog tabs / Firestore `shopCategory` on `catalogProductSettings` docs. */

export const SHOP_CATEGORY_IDS = ["mens", "womens", "accessories"];

/** Short labels for tab buttons */
export const SHOP_CATEGORY_TAB_LABELS = {
  mens: "Mens",
  womens: "Womens",
  accessories: "Accessories",
};

/**
 * @param {unknown} value
 * @returns {"mens"|"womens"|"accessories"|null}
 */
export function normalizeShopCategory(value) {
  const v = String(value ?? "")
    .trim()
    .toLowerCase();
  if (SHOP_CATEGORY_IDS.includes(v)) return v;
  return null;
}
