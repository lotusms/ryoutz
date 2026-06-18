import {
  CATALOG_FLAGS_COLLECTION,
  CATALOG_FLAGS_DOC_ID,
  CATALOG_PRODUCT_SETTINGS_COLLECTION,
} from "@/lib/catalog-merchandising-constants";
import { getFirebaseAdminDb } from "@/lib/firebase-admin-server";

export {
  CATALOG_FLAGS_COLLECTION,
  CATALOG_FLAGS_DOC_ID,
  CATALOG_PRODUCT_SETTINGS_COLLECTION,
} from "@/lib/catalog-merchandising-constants";

export { applyCatalogMerchandising } from "@/lib/catalog-merchandising-apply";

/**
 * True when at least one Firebase Admin credential source is present in env.
 * Used to skip Firestore calls entirely (and the noisy "no project id" error)
 * during local dev when credentials are intentionally absent.
 */
function hasFirebaseAdminCredentials() {
  return (
    Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) ||
    Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim()) ||
    Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim())
  );
}

/** One-time info log so the dev console isn't spammed on every server render. */
let merchandisingDisabledLogged = false;

/**
 * Loads per-product merchandising from Firestore (server-side).
 *
 * @returns {Promise<{ customMerchandising: boolean, bySlug: Map<string, Record<string, unknown>>, adminSdkReachable: boolean }>}
 */
export async function loadCatalogMerchandisingState() {
  const empty = {
    customMerchandising: false,
    bySlug: new Map(),
    adminSdkReachable: false,
  };

  // Intentional dev / preview case: no credentials at all. Log once per
  // process and fall back to defaults silently for every subsequent call.
  if (!hasFirebaseAdminCredentials()) {
    if (!merchandisingDisabledLogged) {
      merchandisingDisabledLogged = true;
      console.info(
        "[catalog-merchandising] Firestore merchandising disabled (no FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_PATH, or GOOGLE_APPLICATION_CREDENTIALS) — using catalog defaults.",
      );
    }
    return empty;
  }

  try {
    const db = getFirebaseAdminDb();
    const flagsSnap = await db
      .collection(CATALOG_FLAGS_COLLECTION)
      .doc(CATALOG_FLAGS_DOC_ID)
      .get();
    const customMerchandising = Boolean(
      flagsSnap.exists && flagsSnap.data()?.customMerchandising === true,
    );

    const settingsSnap = await db.collection(CATALOG_PRODUCT_SETTINGS_COLLECTION).get();
    const bySlug = new Map();
    settingsSnap.forEach((doc) => {
      bySlug.set(doc.id, doc.data() || {});
    });
    return { customMerchandising, bySlug, adminSdkReachable: true };
  } catch (err) {
    // Credentials were configured but the call still failed — this is a real
    // problem and worth warning every time so it isn't missed.
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      "[catalog-merchandising] Firestore merchandising call failed despite configured credentials:",
      msg,
    );
    return empty;
  }
}
