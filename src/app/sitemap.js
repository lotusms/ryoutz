import { listFirestoreGallerySlugs } from "@/lib/gallery-firestore";
import { absoluteUrl, SITEMAP_STATIC_ROUTES } from "@/lib/seo";

/** @type {import("next").MetadataRoute.Sitemap} */
export default async function sitemap() {
  const now = new Date();
  const staticEntries = SITEMAP_STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  let galleryEntries = [];
  try {
    const slugs = await listFirestoreGallerySlugs();
    galleryEntries = slugs.map(({ slug }) => ({
      url: absoluteUrl(`/gallery/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    galleryEntries = [];
  }

  return [...staticEntries, ...galleryEntries];
}
