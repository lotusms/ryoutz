import { unstable_noStore as noStore } from "next/cache";

import PageLayout from "@/components/PageLayout";
import GalleryCatalogClient from "@/components/gallery/GalleryCatalogClient";
import { orgLegalName, orgName, sitePageTitle } from "@/config";
import { getFirestoreGalleryProducts } from "@/lib/gallery-firestore";

export const metadata = {
  title: sitePageTitle("Gallery"),
  description: `Project gallery by ${orgLegalName} — driveways, parking lots, crack sealing, and resurfacing work across the service area.`,
};

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
      <GalleryCatalogClient initialProducts={initialProducts} />
    </PageLayout>
  );
}
