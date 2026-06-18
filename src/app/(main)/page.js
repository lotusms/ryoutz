import { unstable_noStore as noStore } from "next/cache";
import HomeBookingCTA from "@/components/home/HomeBookingCTA";
import HomeCollectionPreview from "@/components/home/HomeCollectionPreview";
import HomeLensCarouselHero from "@/components/home/HomeLensCarouselHero";
import HomeAwardsStrip from "@/components/home/HomeAwardsStrip";
import { pickPortraitHeroProducts } from "@/lib/catalogSort";
import { getHomeLensHeroImagePaths } from "@/lib/home-lens-hero-images";
import {
  getFirestoreGalleryProducts,
  selectHomeCollectionPreviewProducts,
} from "@/lib/gallery-firestore";

function galleryStorageMediaUrl(storageObjectPath) {
  const bucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    "ryoutz.firebasestorage.app";
  const encoded = encodeURIComponent(storageObjectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encoded}?alt=media`;
}

/** Curated trio for the booking CTA collage (`src` = full Firebase Storage download URLs). */
const HOME_BOOKING_CTA_IMAGES = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/gallery%2Fkat-jack.png?alt=media&token=ab361c65-a52b-484d-ad87-f9e7ff05560c",
    alt: "Kat & Jack",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/gallery%2Fkatie-and-eric.png?alt=media&token=722e6409-3a3b-4b3e-a3e8-fe9227e07185",
    alt: "Katie & Eric",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/gallery%2Fsean-and-isis.png?alt=media&token=cb25b82b-dc46-412c-991e-e38aa49e3ba8",
    alt: "Sean & Isis",
  },
];

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
  const lensHeroImages = getHomeLensHeroImagePaths();
  const useLocalHero = lensHeroImages.length > 0;

  return (
    <main className="pt-16">
      <HomeLensCarouselHero
        lensHeroImages={lensHeroImages}
        heroProducts={useLocalHero ? [] : heroProducts}
      />

      <div className="mx-auto mb-10 h-0.5 max-w-5xl bg-slate-200/20" />

      <HomeCollectionPreview initialProducts={collectionPreviewProducts} />

      <div className="mx-auto h-0.5 max-w-5xl bg-slate-200/20" />

      {/* Hidden until asphalt customer testimonials and photos are ready. */}
      {/* <HomeTestimonialWheel /> */}

      <HomeAwardsStrip />

      <div className="mx-auto h-0.5 max-w-5xl bg-slate-200/20" />

      <HomeBookingCTA images={HOME_BOOKING_CTA_IMAGES} />
    </main>
  );
}
