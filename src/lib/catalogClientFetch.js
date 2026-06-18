/**
 * Client-side catalog fetch with retries + cache busting.
 * Matches server-side cold-start resilience: first paint on / and /gallery can otherwise
 * get an empty list until a full refresh.
 *
 * When `/api/catalog/products` returns nothing (e.g. Vercel Preview without
 * `FIREBASE_SERVICE_ACCOUNT_JSON`), falls back to the Firebase **client** SDK
 * so public Firestore rules can still populate the gallery.
 */

import { hasFirebaseConfig } from "@firebase/config";
import { pickPortraitHeroProducts } from "@/lib/catalogSort";
import { selectHomeCollectionPreviewProducts } from "@/lib/gallery-home-selection";

const MAX_ATTEMPTS = 3;
const RETRY_GAP_MS = 450;

function stripMerchandisingMeta(product) {
  const { featured, onHomeSlider, catalogAvailable, ...rest } = product;
  return rest;
}

/**
 * @param {{ context?: string }} [options]
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchCatalogProductList(options = {}) {
  const { context } = options;
  let lastList = [];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, RETRY_GAP_MS * attempt));
    }
    const qs = new URLSearchParams();
    if (context) qs.set("context", context);
    qs.set("_", String(Date.now()));

    const res = await fetch(`/api/catalog/products?${qs.toString()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      /* keep lastList */
    }

    const list = Array.isArray(data?.products) ? data.products : [];
    lastList = list;
    if (list.length > 0) return list;
  }

  if (typeof window !== "undefined" && hasFirebaseConfig()) {
    try {
      const { fetchGalleryCatalogInBrowser } = await import(
        "@/lib/gallery-catalog-browser"
      );
      let fromClient = await fetchGalleryCatalogInBrowser();
      if (fromClient.length > 0) {
        if (context === "home-collection") {
          fromClient = selectHomeCollectionPreviewProducts(fromClient, 6);
        } else if (context === "home-hero") {
          fromClient = pickPortraitHeroProducts(
            fromClient.filter((p) => p.onHomeSlider),
            8,
          );
        }
        return fromClient.map(stripMerchandisingMeta);
      }
    } catch (e) {
      console.warn("[catalogClientFetch] browser Firestore fallback failed:", e);
    }
  }

  return lastList;
}
