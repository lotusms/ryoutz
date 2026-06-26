"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import HeroRoadLineOverlay from "@/components/home/HeroRoadLineOverlay";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { orgName } from "@/config";
import { displayTitleFromImageFilename } from "@/lib/image-filename-display-title";

const ROTATE_MS = 7500;
const SLIDE_FADE_MS = 2200;

function slideAltFromProduct(product, index) {
  const title = String(product?.title || "Asphalt project").trim();
  return `Project photo ${index + 1}: ${title}. ${orgName}.`;
}

/** Derive readable alt text from `/images/home-lens-hero-images/...`. */
function slideAltFromPath(src, index) {
  const file = src.split("/").pop() || "";
  const label =
    displayTitleFromImageFilename(file) || `slide ${index + 1}`;
  return `Project photo ${index + 1}: ${label}. ${orgName}.`;
}

export default function HomeCarouselHero({
  lensHeroImages = [],
  heroProducts = [],
  showRoadLines = true,
  roadLineOpacity = 0.2,
}) {
  const slides = useMemo(() => {
    const local = Array.isArray(lensHeroImages)
      ? lensHeroImages.filter((s) => typeof s === "string" && s.trim())
      : [];
    if (local.length > 0) {
      return local.map((src) => ({
        id: src,
        image: src,
        source: "local",
      }));
    }
    const list = Array.isArray(heroProducts) ? heroProducts.filter((p) => p?.image?.trim()) : [];
    if (list.length > 0) {
      return list.map((p) => ({ ...p, source: "catalog" }));
    }
    return null;
  }, [lensHeroImages, heroProducts]);

  const [index, setIndex] = useState(0);
  const slideCount = slides?.length ?? 0;
  const activeIndex =
    slideCount > 0 ? Math.min(index, slideCount - 1) : 0;

  useEffect(() => {
    if (slideCount <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [slideCount]);

  return (
    <section className="relative -mt-16 min-h-dvh w-full overflow-hidden bg-slate-950">
      {/* Full-bleed carousel */}
      <div className="absolute inset-0 z-0">
        {slides ? (
          slides.map((p, idx) => (
            <div
              key={p.id}
              className={`absolute inset-0 transition-opacity ease-in-out ${
                idx === activeIndex ? "z-1 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              aria-hidden={idx !== activeIndex}
              style={{ transitionDuration: `${SLIDE_FADE_MS}ms` }}
            >
              <Image
                src={p.image}
                alt={
                  p.source === "local"
                    ? slideAltFromPath(p.image, idx)
                    : slideAltFromProduct(p, idx)
                }
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? "high" : "low"}
                loading={idx > 0 ? "lazy" : undefined}
                sizes="100vw"
                quality={88}
                className="object-cover object-center scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          ))
        ) : (
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(37,99,235,0.12),transparent_45%),linear-gradient(165deg,#020617_0%,#0f172a_45%,#020617_100%)]"
            aria-hidden
          />
        )}
      </div>

      {showRoadLines ? <HeroRoadLineOverlay opacity={roadLineOpacity} /> : null}

      {/* Foreground copy + CTAs */}
      <div className="relative z-3 flex min-h-dvh flex-col justify-center px-6 pt-24 pb-14 sm:px-10 sm:pb-16 sm:pt-32 lg:px-14">
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-blue-400">{orgName}</p>
          <h1 className="font-serif mt-5 text-4xl font-bold capitalize leading-[1.18] tracking-[-0.03em] text-white sm:text-6xl sm:leading-[1.15] lg:text-7xl lg:leading-[1.14]">
            Surfaces built to last
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-200/90 sm:text-lg">
            Professional asphalt maintenance, sealing, and repair for driveways,
            parking lots, and private roads, done cleanly, on schedule, and built
            to stand up to weather and daily traffic.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <PrimaryButton href="/contact">Get a free estimate</PrimaryButton>
            <SecondaryButton href="/gallery">See our work</SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
