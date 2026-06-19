"use client";

import Image from "next/image";
import Link from "next/link";

import HeroRoadLineOverlay from "@/components/home/HeroRoadLineOverlay";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { orgName } from "@/config";

const DEFAULT_HERO_IMAGE = "/images/home-lens-hero-images/house2.png";

function HeroAccentLine() {
  return (
    <div className="mt-5 flex max-w-lg items-center gap-2" aria-hidden>
      <span className="h-1 w-14 shrink-0 bg-blue-500 sm:w-20" />
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
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={88}
          className="object-cover object-[52%_52%] scale-[1.01] sm:object-[58%_48%] lg:object-[62%_44%]"
        />
        {/* Smooth left → right fade (no hard stop); light bottom lift for value bar */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: [
              "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 22%, transparent 48%)",
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.98) 22%, rgba(0,0,0,0.94) 38%, rgba(0,0,0,0.88) 50%, rgba(0,0,0,0.52) 64%, rgba(0,0,0,0.24) 78%, rgba(0,0,0,0.07) 90%, transparent 100%)",
            ].join(", "),
          }}
        />
      </div>

      {showRoadLines ? (
        <HeroRoadLineOverlay opacity={roadLineOpacity} className="z-1" />
      ) : null}

      <div className="relative z-2 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-8 pt-24 sm:px-10 sm:pb-10 sm:pt-28 lg:px-12">
        <div className="max-w-xl text-left">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-blue-400">
            {orgName}
          </p>

          <h1 className="font-serif mt-5 text-4xl font-bold uppercase italic leading-[1.12] tracking-[-0.03em] text-white sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.08] xl:text-7xl">
            Surfaces built to last
          </h1>

          <HeroAccentLine />

          <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-200/90 sm:text-lg">
            Professional asphalt maintenance, sealing, and repair for driveways,
            parking lots, and private roads — done cleanly, on schedule, and built
            to stand up to weather and daily traffic.
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
            <PrimaryButton href="/contact">Get a free estimate</PrimaryButton>
            <Link
              href="/gallery"
              className="inline-flex min-w-fit items-center justify-center gap-2 rounded-full border-2 border-amber-500/75 bg-transparent px-6 py-3.5 font-serif text-sm font-semibold capitalize tracking-wide text-amber-400 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0"
            >
              See our work
              <span aria-hidden className="text-base leading-none">
                ›
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
