import { sortCatalogByRecency } from "@/lib/catalogSort";

/**
 * Heart-led home preview: prefer pieces flagged `featured` in
 * `catalogProductSettings`, otherwise the newest `limit` rows from the
 * `gallery` collection (same logic as `/api/catalog/products` with
 * `context=home-collection`).
 *
 * @param {Array<Record<string, unknown>>} catalog — merged gallery + merchandising rows
 * @param {number} [limit]
 */
export function selectHomeCollectionPreviewProducts(catalog, limit = 6) {
  if (!Array.isArray(catalog) || catalog.length === 0) return [];
  const recent = sortCatalogByRecency(catalog);
  const featured = sortCatalogByRecency(catalog.filter((p) => p.featured)).slice(
    0,
    limit,
  );
  return featured.length > 0 ? featured : recent.slice(0, limit);
}
