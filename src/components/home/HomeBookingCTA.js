"use client";

import Image from "next/image";
import { useState } from "react";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import ScrollSlideIn from "@/components/ui/ScrollSlideIn";
import { orgName } from "@/config";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

/**
 * Three frames are stacked behind a slight rotation each — like prints fanned
 * on a table. Sizes/positions are tuned so the trio reads as a single
 * composition without a single image dominating.
 */
const FRAME_LAYOUT = [
  {
    rotate: "lg:-rotate-[7deg] -rotate-[5deg]",
    position:
      "left-0 top-0 w-[58%] sm:w-[55%] lg:w-[58%] aspect-[3/4]",
    z: "z-10",
    elevation: "shadow-[0_28px_60px_-22px_rgba(0,0,0,0.55)]",
  },
  {
    rotate: "lg:rotate-[6deg] rotate-[4deg]",
    position:
      "right-0 top-[18%] w-[52%] sm:w-[50%] lg:w-[55%] aspect-[4/5]",
    z: "z-20",
    elevation: "shadow-[0_34px_70px_-20px_rgba(0,0,0,0.6)]",
  },
  {
    rotate: "lg:-rotate-[3deg] -rotate-[2deg]",
    position:
      "left-[14%] bottom-0 w-[60%] sm:w-[58%] lg:w-[62%] aspect-[5/4]",
    z: "z-30",
    elevation: "shadow-[0_36px_72px_-18px_rgba(0,0,0,0.65)]",
  },
];

function FrameImage({ image, frame, light }) {
  const [failed, setFailed] = useState(false);
  const matteClass = light
    ? "bg-white ring-1 ring-stone-300/60"
    : "bg-stone-100 ring-1 ring-stone-200/40";

  return (
    <div
      className={`absolute ${frame.position} ${frame.rotate} ${frame.z} ${frame.elevation} ${matteClass} rounded-sm p-2.5 transition-transform duration-700 ease-out hover:rotate-0 hover:scale-[1.03]`}
    >
      <div className="relative h-full w-full overflow-hidden bg-stone-200">
        {image?.src && !failed ? (
          <Image
            src={image.src}
            alt={image.alt || `Photograph by ${orgName}`}
            fill
            sizes="(max-width: 1024px) 60vw, 28vw"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.28em] text-stone-500">
            {orgName}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Editorial booking CTA. Pairs a conversational headline + two CTAs with a
 * small photo collage (passed in via `images`). Theme-aware so it sits
 * naturally between the gold testimonial section and the page footer.
 *
 * @param {{
 *   images?: Array<{ src: string; alt?: string }>;
 * }} props
 */
export default function HomeBookingCTA({ images = [] }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);

  const frameImages = [
    images[0] ?? null,
    images[1] ?? images[0] ?? null,
    images[2] ?? images[1] ?? images[0] ?? null,
  ];

  const eyebrow = light
    ? "text-[11px] font-medium uppercase tracking-[0.34em] text-amber-800"
    : "text-[11px] font-medium uppercase tracking-[0.34em] text-amber-300";

  const heading = light
    ? "font-serif text-stone-900"
    : "font-serif text-stone-50";

  const headingAccent = light
    ? "italic text-amber-700"
    : "italic text-amber-300";

  const lead = light
    ? "mt-7 max-w-xl text-base leading-8 text-stone-700"
    : "mt-7 max-w-xl text-base leading-8 text-stone-200/85";

  const micro = light
    ? "mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500"
    : "mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-400";

  const dotClass = light ? "text-stone-300" : "text-stone-600";

  return (
    <section
      id="booking"
      aria-labelledby="booking-heading"
      className="relative z-10 w-full overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      {/* Soft warm vignette so this section feels distinct without a card boundary */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          light
            ? "bg-[radial-gradient(ellipse_70%_55%_at_85%_15%,rgba(254,243,199,0.55),transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_90%,rgba(120,53,15,0.06),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_70%_55%_at_85%_15%,rgba(120,53,15,0.18),transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_90%,rgba(28,25,23,0.5),transparent_55%)]"
        }`}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 overflow-x-clip px-6 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-24 lg:px-12">
        <ScrollSlideIn direction="left" className="relative">
          <p className={eyebrow}>Now booking · 2026 / 2027</p>

          <h2
            id="booking-heading"
            className={`${heading} mt-6 text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl`}
          >
            Let&apos;s tell{" "}
            <span className={headingAccent}>yours</span>{" "}
            next.
          </h2>

          <p className={lead}>
            A handful of weddings, elopements, and portrait sessions each
            year, held with patience, photographed without performance. For
            people who want to remember the day, not perform it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <PrimaryButton href="/contact">Start the conversation</PrimaryButton>
            <SecondaryButton href="/gallery">See more work</SecondaryButton>
          </div>

          <p className={micro}>
            <span>Replies within 24 hours</span>
            <span className={dotClass} aria-hidden="true">·</span>
            <span>Harrisburg, York, and Lancaster Counties</span>
            <span className={dotClass} aria-hidden="true">·</span>
            <span>Limited dates each season</span>
          </p>
        </ScrollSlideIn>

        <ScrollSlideIn
          direction="right"
          delay={100}
          className="relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none"
        >
          {FRAME_LAYOUT.map((frame, idx) => (
            <FrameImage
              key={idx}
              image={frameImages[idx]}
              frame={frame}
              light={light}
            />
          ))}

          {/* Hand-written feeling tag tucked into the collage */}
          <div
            aria-hidden="true"
            className={`absolute -top-2 right-2 z-40 rotate-[8deg] rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] ${
              light
                ? "bg-stone-900 text-amber-100 shadow-md shadow-stone-900/30"
                : "bg-amber-300 text-stone-900 shadow-md shadow-stone-950/40"
            }`}
          >
            est. {orgName.split(" ")[0].toLowerCase()}
          </div>
        </ScrollSlideIn>
      </div>
    </section>
  );
}
