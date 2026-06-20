"use client";

import Image from "next/image";

import HeroRoadLineOverlay from "@/components/home/HeroRoadLineOverlay";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { orgName } from "@/config";

const DEFAULT_HERO_IMAGE = "/images/home-lens-hero-images/house2.png";

function HeroAccentLine() {
  return (
    <div className="mt-4 flex max-w-lg items-center gap-2 sm:mt-5" aria-hidden>
      <span className="h-1 w-12 shrink-0 bg-blue-500 sm:w-20" />
      <span className="flex-1 border-t border-dashed border-blue-500 sm:border-t-4" />
    </div>
  );
}

/**
 * Static home hero — wireframe layout (background image, headline, CTAs).
 * Carousel lives in `HomeCarouselHero`; swap via `page.js`.
 *
 * @param {{ imageSrc?: string; imageAlt?: string; showRoadLines?: boolean; roadLineOpacity?: number }} props
 */
export default function HomeHero({
  imageSrc = DEFAULT_HERO_IMAGE,
  imageAlt = "Freshly paved residential driveway at dusk",
  showRoadLines = false,
  roadLineOpacity = 0.2,
}) {
  const desktopScrim = [
    "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 22%, transparent 48%)",
    "linear-gradient(to right, #000 0%, rgba(0,0,0,0.98) 22%, rgba(0,0,0,0.94) 38%, rgba(0,0,0,0.88) 50%, rgba(0,0,0,0.52) 64%, rgba(0,0,0,0.24) 78%, rgba(0,0,0,0.07) 90%, transparent 100%)",
  ].join(", ");

  const mobileScrim =
    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.62) 32%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0.06) 78%, transparent 92%)";

  return (
    <div className="relative flex min-h-[min(72svh,40rem)] flex-1 flex-col sm:min-h-0">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={88}
          className="object-cover object-[64%_40%] scale-[1.02] sm:object-[58%_48%] sm:scale-[1.01] lg:object-[62%_44%]"
        />
        <div
          className="absolute inset-0 sm:hidden"
          aria-hidden
          style={{ backgroundImage: mobileScrim }}
        />
        <div
          className="absolute inset-0 hidden sm:block"
          aria-hidden
          style={{ backgroundImage: desktopScrim }}
        />
      </div>

      {showRoadLines ? (
        <HeroRoadLineOverlay opacity={roadLineOpacity} className="z-1" />
      ) : null}

      <div className="relative z-2 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 max-sm:pt-[max(5.25rem,calc(4.5rem+env(safe-area-inset-top,0px)))] sm:justify-end sm:px-10 sm:pb-10 sm:pt-28 lg:px-12">
        <div
          className="max-sm:min-h-[24svh] max-sm:flex-1"
          aria-hidden
        />
        <div className="max-w-xl shrink-0 pb-5 text-left sm:pb-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.32em] text-blue-400 sm:text-xs sm:tracking-[0.38em]">
            {orgName}
          </p>

          <h1 className="font-serif mt-4 text-[2rem] font-bold uppercase italic leading-[1.1] tracking-[-0.03em] text-white sm:mt-5 sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.08] xl:text-7xl">
            Surfaces built to last
          </h1>

          <HeroAccentLine />

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-200/90 sm:mt-6 sm:text-base sm:leading-relaxed lg:text-lg">
            Professional asphalt maintenance, sealing, and repair for driveways,
            parking lots, and private roads — done cleanly, on schedule, and built
            to stand up to weather and daily traffic.
          </p>

          <div className="mt-6 flex w-full flex-col items-stretch gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-start sm:gap-4">
            <PrimaryButton href="/contact" className="w-full justify-center sm:w-auto">
              Get a free estimate
            </PrimaryButton>
            <SecondaryButton
              href="/gallery"
              showChevron
              className="w-full justify-center sm:w-auto"
            >
              See our work
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
