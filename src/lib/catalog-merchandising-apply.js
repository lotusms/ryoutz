/**
 * @param {Array<Record<string, unknown>>} products — raw catalog rows
 * @param {{ bySlug: Map<string, Record<string, unknown>> }} state
 * @returns {Array<Record<string, unknown>>}
 */
export function applyCatalogMerchandising(products, state) {
  if (!Array.isArray(products)) return [];
  const { bySlug } = state;

  return products
    .map((p) => {
      const slug = String(p.slug || "");
      const s = bySlug.get(slug) || {};
      const customRaw =
        typeof s.customImageUrl === "string" ? s.customImageUrl.trim() : "";
      const image = customRaw || p.image;
      const available = s.available !== false;

      return {
        ...p,
        image,
        featured: s.featured === true,
        onHomeSlider: s.onHomeSlider === true,
        catalogAvailable: available,
      };
    })
    .filter((p) => p.catalogAvailable);
}
