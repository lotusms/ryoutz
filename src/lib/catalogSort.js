/** FNV-1a hash for stable pseudo-random ordering (not filename or mtime). */
function catalogDisplayHash(value) {
  const s = String(value ?? "");
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable shuffle for gallery grids — avoids gal10, gal9, gal8 filename/mtime ordering. */
export function shuffleCatalogDisplayOrder(products) {
  if (!Array.isArray(products) || products.length <= 1) return products ?? [];
  const out = [...products];
  const rand = mulberry32(catalogDisplayHash("ryoutz-gallery"));
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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
