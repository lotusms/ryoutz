import { unstable_noStore as noStore } from "next/cache";
import HomeSectionDivider from "@/components/ui/HomeSectionDivider";
import HomeBookingCTA from "@/components/home/HomeBookingCTA";
import HomeCollectionPreview from "@/components/home/HomeCollectionPreview";
import HomeTestimonialWheel from "@/components/home/HomeTestimonialWheel";
// import HomeCarouselHero from "@/components/home/HomeCarouselHero";
import { pickPortraitHeroProducts } from "@/lib/catalogSort";
import { getHomeLensHeroImagePaths } from "@/lib/home-lens-hero-images";
import {
  getFirestoreGalleryProducts,
  selectHomeCollectionPreviewProducts,
} from "@/lib/gallery-firestore";
import { selectHomeBookingCtaImages } from "@/lib/home-booking-cta-images";

import HomeHero from "@/components/home/HomeHero";
import HomeValueBar from "@/components/home/HomeValueBar";

export default async function Home() {
  noStore();
  const catalog = await getFirestoreGalleryProducts();
  const heroProducts = pickPortraitHeroProducts(
    catalog.filter((p) => p.onHomeSlider),
    8,
  );
  const collectionPreviewProducts = selectHomeCollectionPreviewProducts(
    catalog,
    6,
  );
  const bookingCtaImages = selectHomeBookingCtaImages(catalog, 3);
  const lensHeroImages = getHomeLensHeroImagePaths();
  const useLocalHero = lensHeroImages.length > 0;

  return (
    <main>
      <section className="relative -mt-16 flex flex-col">
        <div className="relative flex min-h-svh flex-col sm:min-h-[88dvh] lg:min-h-dvh">
          <HomeHero />

          <HomeValueBar />
        </div>
      </section>

      {/* Carousel hero — swap back in when ready */}
      {/* <HomeCarouselHero
        lensHeroImages={lensHeroImages}
        heroProducts={useLocalHero ? [] : heroProducts}
      /> */}

      {/* <div
        aria-hidden
        role="presentation"
        className="relative z-20 mx-auto mb-10 mt-0 block h-1 w-full shrink-0 rounded-full bg-blue-400 px-6 sm:px-10"
      /> */}

      <HomeCollectionPreview initialProducts={collectionPreviewProducts} />

      <HomeSectionDivider className="my-10" />

      <HomeTestimonialWheel />

      <HomeSectionDivider className="my-10" />

      {/* Hidden until asphalt industry awards or certifications are ready. */}
      {/* <HomeAwardsStrip /> */}
      <HomeBookingCTA images={bookingCtaImages} />
    </main>
  );
}
