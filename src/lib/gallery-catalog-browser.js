import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { getFirebaseDb } from "@firebase/client";
import { hasFirebaseConfig } from "@firebase/config";
import { applyCatalogMerchandising } from "@/lib/catalog-merchandising-apply";
import {
  CATALOG_FLAGS_COLLECTION,
  CATALOG_FLAGS_DOC_ID,
  CATALOG_PRODUCT_SETTINGS_COLLECTION,
} from "@/lib/catalog-merchandising-constants";
import {
  GALLERY_COLLECTION,
  shapeGalleryDoc,
  sortRawGalleryProducts,
} from "@/lib/gallery-shape";

/**
 * @param {import("firebase/firestore").Firestore} db
 */
async function loadCatalogMerchandisingStateBrowser(db) {
  try {
    const flagsRef = doc(db, CATALOG_FLAGS_COLLECTION, CATALOG_FLAGS_DOC_ID);
    const [flagsSnap, settingsSnap] = await Promise.all([
      getDoc(flagsRef),
      getDocs(collection(db, CATALOG_PRODUCT_SETTINGS_COLLECTION)),
    ]);
    const customMerchandising = Boolean(
      flagsSnap.exists && flagsSnap.data()?.customMerchandising === true,
    );
    const bySlug = new Map();
    settingsSnap.forEach((d) => {
      bySlug.set(d.id, d.data() || {});
    });
    return { customMerchandising, bySlug, adminSdkReachable: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[gallery-catalog-browser] merchandising read failed:", msg);
    return {
      customMerchandising: false,
      bySlug: new Map(),
      adminSdkReachable: true,
    };
  }
}

/**
 * Public gallery catalog via the Firebase **client** SDK (browser only).
 * Use when Vercel Preview has no Admin credentials but `NEXT_PUBLIC_FIREBASE_*`
 * is set — Firestore rules already allow public reads on `gallery` and
 * merchandising collections.
 *
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchGalleryCatalogInBrowser() {
  if (typeof window === "undefined" || !hasFirebaseConfig()) return [];
  try {
    const db = getFirebaseDb();
    const gallerySnap = await getDocs(collection(db, GALLERY_COLLECTION));
    let raw = gallerySnap.docs.map((d) => shapeGalleryDoc(d));
    raw = sortRawGalleryProducts(raw);
    const merch = await loadCatalogMerchandisingStateBrowser(db);
    return applyCatalogMerchandising(raw, merch);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[gallery-catalog-browser] gallery read failed:", msg);
    return [];
  }
}
