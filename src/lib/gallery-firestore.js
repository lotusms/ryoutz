/**
 * Server-only gallery reader (local work folder → gallery folder → stock).
 * Export names are historical so existing pages keep working.
 */
import { getLocalGalleryProducts, getWorkGalleryProducts } from "@/lib/gallery-local";
import { getStockGalleryProducts } from "@/lib/gallery-stock";

export { GALLERY_COLLECTION } from "@/lib/gallery-shape";
export { selectHomeCollectionPreviewProducts } from "@/lib/gallery-home-selection";

/**
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function getFirestoreGalleryProducts() {
  const work = await getWorkGalleryProducts();
  if (work.length > 0) return work;

  const fromLocal = await getLocalGalleryProducts();
  if (fromLocal.length > 0) return fromLocal;

  return getStockGalleryProducts();
}

/** Lookup helper for `/gallery/[slug]` and metadata. */
export async function getFirestoreGalleryProductBySlug(slug) {
  const wanted = String(slug || "").trim();
  if (!wanted) return null;
  const products = await getFirestoreGalleryProducts();
  return products.find((p) => p.slug === wanted) ?? null;
}

/** Slug list for `generateStaticParams`. */
export async function listFirestoreGallerySlugs() {
  const products = await getFirestoreGalleryProducts();
  return products.map((p) => ({ slug: p.slug }));
}
