import { unstable_noStore as noStore } from "next/cache";

import PageLayout from "@/components/PageLayout";
import GalleryCatalogClient from "@/components/gallery/GalleryCatalogClient";
import { orgLegalName, orgName, sitePageTitle } from "@/config";
import { getFirestoreGalleryProducts } from "@/lib/gallery-firestore";

export const metadata = {
  title: sitePageTitle("Gallery"),
  description: `Wedding photography gallery by ${orgLegalName} — real brides, soft light, and heirloom images from weddings, elopements, and couples sessions. Browse love stories and portrait work by ${orgName}.`,
};

export default async function GalleryPage() {
  // Same as the home page: do not statically freeze the catalog at build time.
  // Without this, a Vercel build without Admin credentials (or an empty DB) ships an empty gallery forever.
  noStore();
  const initialProducts = await getFirestoreGalleryProducts();
  return (
    <PageLayout
      eyebrow="Portfolio"
      title="Gallery"
      subtitle={`If you are dreaming in lace, candlelight, and the quiet second before you walk toward the person you chose — you are in the right place. This wedding photography gallery is filled with the celebrations, stolen glances, and the in-between moments that become our clients' favorites. Browse for inspiration, then tap any image to linger: every frame is a love story captured by ${orgLegalName}, with the patience and heart you want behind your own wedding photos.`}
      width="full"
    >
      <GalleryCatalogClient initialProducts={initialProducts} />
    </PageLayout>
  );
}
