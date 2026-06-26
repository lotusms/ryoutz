/**
 * Client-side catalog fetch with retries + cache busting.
 */

const MAX_ATTEMPTS = 3;
const RETRY_GAP_MS = 450;

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

  return lastList;
}
