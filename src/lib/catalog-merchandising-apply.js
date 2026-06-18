import { normalizeShopCategory } from "@/lib/shopCategories";

/**
 * @param {Array<Record<string, unknown>>} products — raw catalog rows
 * @param {{ bySlug: Map<string, Record<string, unknown>>, customMerchandising?: boolean, adminSdkReachable?: boolean }} state
 * @returns {Array<Record<string, unknown>>}
 */
export function applyCatalogMerchandising(products, state) {
  if (!Array.isArray(products)) return [];
  const { bySlug } = state;
  const adminOk = state.adminSdkReachable !== false;

  return products
    .map((p) => {
      const slug = String(p.slug || "");
      const s = bySlug.get(slug) || {};
      const customRaw =
        typeof s.customImageUrl === "string" ? s.customImageUrl.trim() : "";
      const image = customRaw || p.image;

      const available = s.available !== false;

      /**
       * Home hero + collection are opt-in via Firestore when Admin SDK works.
       * If Admin is unreachable (e.g. missing `FIREBASE_SERVICE_ACCOUNT_JSON` on Vercel), treat
       * every visible product as eligible so the homepage is not empty until env is fixed.
       */
      const featured = adminOk ? s.featured === true : true;
      const onHomeSlider = adminOk ? s.onHomeSlider === true : true;

      const shopCategory = normalizeShopCategory(s.shopCategory);

      return {
        ...p,
        image,
        featured,
        onHomeSlider,
        catalogAvailable: available,
        shopCategory,
      };
    })
    .filter((p) => p.catalogAvailable);
}
