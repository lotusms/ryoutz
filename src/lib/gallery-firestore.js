/**
 * Server-only gallery reader.
 *
 * Primary source is configurable via `GALLERY_SOURCE`:
 *   - `local`     — `public/images/gallery` only (see `gallery-local.js`)
 *   - `stock`     — free Pexels placeholders (see `gallery-stock.js`)
 *   - `firestore` — Firestore `gallery` collection only (requires Admin credentials)
 *   - `auto`      — Firestore → local → stock (default)
 *
 * Export names are historical (`getFirestoreGalleryProducts`) so existing pages keep working.
 */
import {
  applyCatalogMerchandising,
  loadCatalogMerchandisingState,
} from "@/lib/catalog-merchandising";
import { getLocalGalleryProducts } from "@/lib/gallery-local";
import { getStockGalleryProducts } from "@/lib/gallery-stock";
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

/** @returns {"local" | "stock" | "firestore" | "auto"} */
function resolveGallerySource() {
  const raw = String(process.env.GALLERY_SOURCE || "auto").trim().toLowerCase();
  if (raw === "local") return "local";
  if (raw === "stock") return "stock";
  if (raw === "firestore" || raw === "firebase") return "firestore";
  return "auto";
}

let warnedMissingCreds = false;
let loggedLocalFallback = false;
let loggedStockFallback = false;

async function loadFirestoreGalleryProducts() {
  if (!hasAdminCredentials()) {
    if (!warnedMissingCreds) {
      warnedMissingCreds = true;
      console.info(
        "[gallery-firestore] Firebase Admin credentials missing — skipping Firestore gallery read.",
      );
    }
    return [];
  }

  try {
    const db = getFirebaseAdminDb();
    const snap = await db.collection(GALLERY_COLLECTION).get();
    const raw = sortRawGalleryProducts(snap.docs.map(shapeGalleryDoc));
    const merchState = await loadCatalogMerchandisingState();
    return applyCatalogMerchandising(raw, merchState);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[gallery-firestore] read failed: ${msg}`);
    return [];
  }
}

/**
 * @returns {Promise<Array<Record<string, unknown>>>} merchandising-applied gallery rows.
 */
export async function getFirestoreGalleryProducts() {
  const source = resolveGallerySource();

  if (source === "local") {
    return getLocalGalleryProducts();
  }

  if (source === "stock") {
    return getStockGalleryProducts();
  }

  const fromFirestore = await loadFirestoreGalleryProducts();
  if (source === "firestore") {
    return fromFirestore;
  }

  if (fromFirestore.length > 0) {
    return fromFirestore;
  }

  const fromLocal = await getLocalGalleryProducts();
  if (fromLocal.length > 0) {
    if (!loggedLocalFallback) {
      loggedLocalFallback = true;
      console.info(
        `[gallery] Serving ${fromLocal.length} piece(s) from public/images/gallery (Firestore empty or unavailable).`,
      );
    }
    return fromLocal;
  }

  const fromStock = await getStockGalleryProducts();
  if (fromStock.length > 0 && !loggedStockFallback) {
    loggedStockFallback = true;
    console.info(
      `[gallery] Serving ${fromStock.length} stock placeholder(s) from Pexels (add real photos to public/images/gallery when ready).`,
    );
  }
  return fromStock;
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
