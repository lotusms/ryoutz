import { orgName } from "@/config";

/** Prefer real asphalt project photos when present in the catalog. */
const PREFERRED_SLUGS = [
  "parkinglot",
  "homedriveway",
  "crackfilling",
  "commercial-parking-lot",
  "residential-driveway",
  "crack-filling",
  "parking-lot-aerial",
  "fresh-asphalt-road",
];

/**
 * Three collage frames for `HomeBookingCTA` — uses the same gallery catalog
 * (local / stock / Firestore via `getFirestoreGalleryProducts`).
 *
 * @param {Array<{ slug?: string; title?: string; image?: string }>} catalog
 * @param {number} [limit]
 * @returns {Array<{ src: string; alt: string }>}
 */
export function selectHomeBookingCtaImages(catalog, limit = 3) {
  const list = Array.isArray(catalog)
    ? catalog.filter((p) => typeof p?.image === "string" && p.image.trim())
    : [];

  const picked = [];

  for (const key of PREFERRED_SLUGS) {
    const match = list.find((p) => String(p.slug || "") === key);
    if (match && !picked.some((q) => q.slug === match.slug)) {
      picked.push(match);
    }
    if (picked.length >= limit) break;
  }

  for (const p of list) {
    if (picked.length >= limit) break;
    if (!picked.some((q) => q.slug === p.slug)) picked.push(p);
  }

  return picked.slice(0, limit).map((p) => ({
    src: p.image.trim(),
    alt: `${String(p.title || "Asphalt project").trim()} — ${orgName}`,
  }));
}
