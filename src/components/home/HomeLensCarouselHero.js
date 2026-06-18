"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { orgName } from "@/config";
import { displayTitleFromImageFilename } from "@/lib/image-filename-display-title";

const ROTATE_MS = 7500;
const SLIDE_FADE_MS = 2200;

function slideAltFromProduct(product, index) {
  const title = String(product?.title || "Photography").trim();
  return `Portfolio photograph ${index + 1}: ${title}. ${orgName}.`;
}

/** Derive readable alt text from `/images/home-lens-hero-images/...`. */
function slideAltFromPath(src, index) {
  const file = src.split("/").pop() || "";
  const label =
    displayTitleFromImageFilename(file) || `slide ${index + 1}`;
  return `Portfolio photograph ${index + 1}: ${label}. ${orgName}.`;
}

const ROAD_LINE = {
  white: "#FFFFFF",
  yellowA: "#FFD316",
  yellowB: "#F0B90B",
};

const CORNER_SIZE = 480;

const YELLOW_INNER = 388;
const YELLOW_OUTER = 404;
const WHITE_GAP = 68;

/** Parallel stripes: white dash — double yellow — white dash (symmetric spacing). */
const CORNER_STRIPES = [
  { offset: YELLOW_INNER - WHITE_GAP, dashed: true },
  { offset: YELLOW_INNER, color: ROAD_LINE.yellowA },
  { offset: YELLOW_OUTER, color: ROAD_LINE.yellowB },
  { offset: YELLOW_OUTER + WHITE_GAP, dashed: true },
];

/** Exact diagonal stripe — weathering is applied via SVG filter only. */
function buildStripePath(x1, y1, x2, y2) {
  return `M ${x1},${y1} L ${x2},${y2}`;
}

/** Precomputed so SSR and client markup always match (avoids hydration mismatch). */
const PAINTED_STRIPE_PATHS = {
  "top-left": CORNER_STRIPES.map((stripe) =>
    buildStripePath(0, stripe.offset, stripe.offset, 0),
  ),
  "bottom-right": CORNER_STRIPES.map((stripe) => {
    const k = stripe.offset;
    return buildStripePath(
      CORNER_SIZE - k,
      CORNER_SIZE,
      CORNER_SIZE,
      CORNER_SIZE - k,
    );
  }),
};

/** SVG filter: weathering clipped to stroke pixels only (no full-canvas bleed). */
function WeatheredPaintFilter({ id }) {
  return (
    <filter
      id={id}
      filterUnits="objectBoundingBox"
      x="-0.35"
      y="-0.35"
      width="1.7"
      height="1.7"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.62 0.11"
        numOctaves="3"
        seed="8"
        result="edgeNoise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="edgeNoise"
        scale="1.15"
        xChannelSelector="R"
        yChannelSelector="G"
        result="paint"
      />

      <feTurbulence
        type="fractalNoise"
        baseFrequency="1.35 0.42"
        numOctaves="4"
        seed="21"
        result="chipNoise"
      />
      <feComponentTransfer in="chipNoise" result="chipMask">
        <feFuncR type="linear" slope="0" intercept="0" />
        <feFuncG type="linear" slope="0" intercept="0" />
        <feFuncB type="linear" slope="0" intercept="0" />
        <feFuncA
          type="table"
          tableValues="0.08 0.48 0.14 0.55 0.1 0.42 0.12 0.5"
        />
      </feComponentTransfer>
      <feComposite
        in="chipMask"
        in2="SourceGraphic"
        operator="in"
        result="chipOnStroke"
      />
      <feComposite in="paint" in2="chipOnStroke" operator="out" result="chipped" />

      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.22 0.08"
        numOctaves="3"
        seed="14"
        result="fadeNoise"
      />
      <feComponentTransfer in="fadeNoise" result="fadeMask">
        <feFuncR type="linear" slope="0" intercept="0" />
        <feFuncG type="linear" slope="0" intercept="0" />
        <feFuncB type="linear" slope="0" intercept="0" />
        <feFuncA
          type="table"
          tableValues="0.55 0.95 0.62 0.88 0.5 0.92 0.58 0.85"
        />
      </feComponentTransfer>
      <feComposite
        in="fadeMask"
        in2="SourceGraphic"
        operator="in"
        result="fadeOnStroke"
      />
      <feBlend in="chipped" in2="fadeOnStroke" mode="screen" result="faded" />

      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.09 0.28"
        numOctaves="2"
        seed="33"
        result="crackNoise"
      />
      <feColorMatrix
        in="crackNoise"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 7 -2.4"
        result="crackMask"
      />
      <feComposite
        in="crackMask"
        in2="SourceGraphic"
        operator="in"
        result="cracksOnStroke"
      />
      <feFlood floodColor="#141414" floodOpacity="0.28" result="crackColor" />
      <feComposite in="crackColor" in2="cracksOnStroke" operator="in" result="cracks" />
      <feComposite in="faded" in2="cracks" operator="over" result="weathered" />
      <feColorMatrix
        in="weathered"
        type="matrix"
        values="1.12 0 0 0 0.04
                0 1.1 0 0 0.03
                0 0 0.98 0 0.01
                0 0 0 1.12 0"
        result="boosted"
      />
      <feComposite in="boosted" in2="SourceGraphic" operator="in" />
    </filter>
  );
}

function RoadLineCorner({ filterId, corner = "top-left" }) {
  const isTopLeft = corner === "top-left";
  const size = CORNER_SIZE;

  const positionClass = isTopLeft
    ? "left-0 top-0"
    : "right-0 bottom-0";

  const dimensionClass =
    "h-[min(66vw,32rem)] w-[min(66vw,32rem)] sm:h-[min(60vw,36rem)] sm:w-[min(60vw,36rem)]";

  return (
    <svg
      className={`absolute ${positionClass} ${dimensionClass} isolate`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <WeatheredPaintFilter id={filterId} />
      </defs>
      <g opacity="0.5">
        {CORNER_STRIPES.map((stripe, idx) => (
          <path
            key={`${corner}-${idx}`}
            d={PAINTED_STRIPE_PATHS[corner][idx]}
            filter={`url(#${filterId})`}
            stroke={stripe.dashed ? ROAD_LINE.white : stripe.color}
            strokeWidth="6"
            strokeDasharray={stripe.dashed ? "92 44" : undefined}
            strokeLinecap="butt"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </g>
    </svg>
  );
}

/** Diagonal road-line overlays in the top-left and bottom-right corners (wireframe). */
function HeroRoadLineOverlay() {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className="pointer-events-none absolute inset-0 z-2 isolate overflow-hidden"
      aria-hidden
    >
      <RoadLineCorner filterId={`${uid}-tl`} corner="top-left" />
      <RoadLineCorner filterId={`${uid}-br`} corner="bottom-right" />
    </div>
  );
}

export default function HomeLensCarouselHero({
  lensHeroImages = [],
  heroProducts = [],
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
    <section className="relative -mt-16 min-h-dvh w-full overflow-hidden bg-stone-950">
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
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(251,191,36,0.1),transparent_45%),linear-gradient(165deg,#020617_0%,#0f172a_45%,#020617_100%)]"
            aria-hidden
          />
        )}
      </div>

      <HeroRoadLineOverlay />

      {/* Foreground copy + CTAs */}
      <div className="relative z-3 flex min-h-dvh flex-col justify-end px-6 pb-14 pt-28 sm:px-10 sm:pb-16 sm:pt-32 lg:px-14">
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-200/80">{orgName}</p>
          <h1 className="font-serif mt-5 text-4xl font-medium leading-[1.18] tracking-[-0.03em] text-white sm:text-6xl sm:leading-[1.15] lg:text-7xl lg:leading-[1.14]">
            <span className="block">Memories</span>
            <span className="text-gradient-hero block">
              that won&apos;t let go of you
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-200/90 sm:text-lg">
            The knot in your throat, your hands shaking, the light on her veil: preserved so vividly you don&apos;t just remember the day.
            <br/> 
            You relive it.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <PrimaryButton href="/contact">Book a session</PrimaryButton>
            <SecondaryButton href="/gallery">View work</SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
