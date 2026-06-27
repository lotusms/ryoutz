import { unstable_noStore as noStore } from "next/cache";

import PageLayout from "@/components/PageLayout";
import GalleryBeforeAfterCTA from "@/components/gallery/GalleryBeforeAfterCTA";
import GalleryCatalogClient from "@/components/gallery/GalleryCatalogClient";
import { orgLegalName, orgName, serviceAreaProse } from "@/config";
import { getFirestoreGalleryProducts } from "@/lib/gallery-firestore";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Gallery",
  description: `Asphalt project gallery by ${orgLegalName}. Driveways, parking lots, sealcoating, and crack repair work in ${serviceAreaProse}.`,
  path: "/gallery",
});

export default async function GalleryPage() {
  // Same as the home page: do not statically freeze the catalog at build time.
  // Without this, a Vercel build without Admin credentials (or an empty DB) ships an empty gallery forever.
  noStore();
  const initialProducts = await getFirestoreGalleryProducts();
  return (
    <PageLayout
      eyebrow="Projects"
      title="Gallery"
      subtitle={`Recent asphalt maintenance, sealcoating, and repair work by ${orgLegalName}. Browse driveways, parking lots, and crack-seal projects — tap any image for details.`}
      width="full"
    >
      <GalleryBeforeAfterCTA />
      <GalleryCatalogClient initialProducts={initialProducts} />
    </PageLayout>
  );
}
