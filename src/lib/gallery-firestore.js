/**
 * Server-only reader for the Firestore `gallery` collection.
 *
 * Returns objects shaped like the legacy `gallery-local.js` output so
 * existing consumers (home page, gallery list, detail page, dashboard API)
 * keep working without a schema migration. Applies the existing
 * `catalogProductSettings` merchandising overrides on top, so the
 * dashboard's Featured / Hero / hide flags still work.
 *
 * **Vercel Preview:** often has no `FIREBASE_SERVICE_ACCOUNT_JSON`; the public
 * site then loads the same data in the browser via `fetchGalleryCatalogInBrowser`
 * (see `catalogClientFetch.js` and `gallery-catalog-browser.js`).
 */
import {
  applyCatalogMerchandising,
  loadCatalogMerchandisingState,
} from "@/lib/catalog-merchandising";
import { GALLERY_COLLECTION, shapeGalleryDoc, sortRawGalleryProducts } from "@/lib/gallery-shape";
import { getFirebaseAdminDb } from "@/lib/firebase-admin-server";

export { GALLERY_COLLECTION } from "@/lib/gallery-shape";
export { selectHomeCollectionPreviewProducts } from "@/lib/gallery-home-selection";

/** Has at least one Firebase Admin credential source been configured? */
function hasAdminCredentials() {
  return (
    Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) ||
    Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim()) ||
    Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim())
  );
}

let warnedMissingCreds = false;

/**
 * @returns {Promise<Array<Record<string, unknown>>>} merchandising-applied gallery rows.
 */
export async function getFirestoreGalleryProducts() {
  if (!hasAdminCredentials()) {
    if (!warnedMissingCreds) {
      warnedMissingCreds = true;
      console.info(
        "[gallery-firestore] Firebase Admin credentials missing — server gallery read is empty; client fallback may still load via Firestore rules.",
      );
    }
    return [];
  }

  let raw = [];
  try {
    const db = getFirebaseAdminDb();
    const snap = await db.collection(GALLERY_COLLECTION).get();
    raw = snap.docs.map(shapeGalleryDoc);
    raw = sortRawGalleryProducts(raw);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[gallery-firestore] read failed: ${msg}`);
    return [];
  }

  const merchState = await loadCatalogMerchandisingState();
  return applyCatalogMerchandising(raw, merchState);
}

/** Lookup helper for `/gallery/[slug]` and metadata. */
export async function getFirestoreGalleryProductBySlug(slug) {
  const wanted = String(slug || "").trim();
  if (!wanted) return null;
  const products = await getFirestoreGalleryProducts();
  return products.find((p) => p.slug === wanted) ?? null;
}

/**
 * Slug list for `generateStaticParams`. Returns visible (available) pieces.
 * Async on purpose — `generateStaticParams` supports async return.
 */
export async function listFirestoreGallerySlugs() {
  const products = await getFirestoreGalleryProducts();
  return products.map((p) => ({ slug: p.slug }));
}
