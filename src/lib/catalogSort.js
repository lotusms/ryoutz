/**
 * Newest-first slice for homepage collection grid (and any “latest N” surface).
 * Sorting matches `sortCatalogByRecency` (file mtime, then stable id).
 */
export function pickRecentCatalogProducts(products, limit = 6) {
  return sortCatalogByRecency(products).slice(0, limit);
}

/** Newest-first for homepage hero, collection preview, and shop-adjacent lists. */
export function sortCatalogByRecency(products) {
  if (!Array.isArray(products)) return [];
  return [...products].sort((a, b) => {
    const tb = Number(b.catalogUpdatedAt) || 0;
    const ta = Number(a.catalogUpdatedAt) || 0;
    if (tb !== ta) return tb - ta;
    const pb = Number(b.printfulProductId);
    const pa = Number(a.printfulProductId);
    if (Number.isFinite(pb) && Number.isFinite(pa) && pb !== pa) {
      return pb - pa;
    }
    return String(b.id ?? b.slug).localeCompare(String(a.id ?? a.slug));
  });
}

/** Taller than wide, using known dimensions when present. */
export function isPortraitCatalogProduct(product) {
  const w = Number(product?.imageWidth);
  const h = Number(product?.imageHeight);
  if (!(w > 0 && h > 0)) return false;
  return h / w > 1;
}

/**
 * Hero slides: only the `products` passed in (already “on home slider” picks).
 * Prefers portrait mockups for ordering; never adds products outside that list.
 */
export function pickPortraitHeroProducts(products, limit = 8) {
  const sorted = sortCatalogByRecency(products);
  const portraits = sorted
    .filter((p) => isPortraitCatalogProduct(p))
    .slice(0, limit);
  if (portraits.length > 0) return portraits;
  return sorted.slice(0, Math.min(limit, sorted.length));
}
