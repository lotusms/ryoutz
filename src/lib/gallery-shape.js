/** Firestore collection id for gallery pieces (same as rules + seed scripts). */
export const GALLERY_COLLECTION = "gallery";

/** Convert a Firestore Timestamp / Date / millis-ish value into milliseconds. */
export function toMillis(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value._seconds === "number") {
    return value._seconds * 1000 + Math.floor((value._nanoseconds ?? 0) / 1e6);
  }
  return 0;
}

/**
 * Map a `gallery/{slug}` Firestore document to the shape consumers expect.
 * Works with Admin `QueryDocumentSnapshot` or client modular `QueryDocumentSnapshot`.
 *
 * @param {{ id: string; data: () => Record<string, unknown> }} doc
 */
export function shapeGalleryDoc(doc) {
  const data = doc.data() || {};
  const slug = String(data.slug || doc.id).trim();
  const imageWidth =
    Number.isFinite(Number(data.imageWidth)) && Number(data.imageWidth) > 0
      ? Number(data.imageWidth)
      : null;
  const imageHeight =
    Number.isFinite(Number(data.imageHeight)) && Number(data.imageHeight) > 0
      ? Number(data.imageHeight)
      : null;

  const sortMs = toMillis(data.sortAt ?? data.updatedAt ?? data.createdAt);
  const sortIndex = Number.isFinite(Number(data.sortIndex))
    ? Number(data.sortIndex)
    : 0;

  return {
    id: slug,
    slug,
    title: String(data.title || slug).trim() || slug,
    description: String(data.description || "").trim(),
    image: String(data.image || "").trim(),
    imageWidth,
    imageHeight,
    medium: String(data.medium || "Photography").trim(),
    dimensions: String(data.dimensions || "").trim(),
    variants: [],
    printfulProductId: null,
    catalogUpdatedAt: sortMs,
    sortIndex,
    storagePath: String(data.storagePath || "").trim(),
    storageBucket: String(data.storageBucket || "").trim(),
  };
}

/** Primary ordering before `applyCatalogMerchandising`. */
export function sortRawGalleryProducts(raw) {
  return [...raw].sort((a, b) => {
    if (a.sortIndex !== b.sortIndex) return a.sortIndex - b.sortIndex;
    if (a.catalogUpdatedAt !== b.catalogUpdatedAt) {
      return b.catalogUpdatedAt - a.catalogUpdatedAt;
    }
    return a.slug.localeCompare(b.slug);
  });
}
