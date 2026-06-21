import {
  shuffleCatalogDisplayOrder,
  sortCatalogByRecency,
} from "@/lib/catalogSort";

function isWorkGalleryProduct(product) {
  return String(product?.image ?? "").includes("/images/gallery/work/");
}

/**
 * Heart-led home preview: prefer pieces flagged `featured` in
 * `catalogProductSettings`, otherwise the first `limit` rows from the
 * catalog (work gallery is already shuffled in `getWorkGalleryProducts`).
 *
 * @param {Array<Record<string, unknown>>} catalog — merged gallery + merchandising rows
 * @param {number} [limit]
 */
export function selectHomeCollectionPreviewProducts(catalog, limit = 6) {
  if (!Array.isArray(catalog) || catalog.length === 0) return [];
  const featured = shuffleCatalogDisplayOrder(
    catalog.filter((p) => p.featured),
  ).slice(0, limit);
  if (featured.length > 0) return featured;
  const ordered = catalog.some(isWorkGalleryProduct)
    ? catalog
    : sortCatalogByRecency(catalog);
  return ordered.slice(0, limit);
}
