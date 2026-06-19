"use client";

import Image from "next/image";
import { useState } from "react";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import ScrollSlideIn from "@/components/ui/ScrollSlideIn";
import { orgName } from "@/config";

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

function FrameImage({ image, frame }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`absolute ${frame.position} ${frame.rotate} ${frame.z} ${frame.elevation} rounded-sm bg-slate-100 p-2.5 ring-1 ring-white/20 transition-transform duration-700 ease-out hover:rotate-0 hover:scale-[1.03]`}
    >
      <div className="relative h-full w-full overflow-hidden bg-slate-800">
        {image?.src && !failed ? (
          <Image
            src={image.src}
            alt={image.alt || `Asphalt project by ${orgName}`}
            fill
            sizes="(max-width: 1024px) 60vw, 28vw"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.28em] text-slate-500">
            {orgName}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   images?: Array<{ src: string; alt?: string }>;
 * }} props
 */
export default function HomeBookingCTA({ images = [] }) {
  const frameImages = [
    images[0] ?? null,
    images[1] ?? images[0] ?? null,
    images[2] ?? images[1] ?? images[0] ?? null,
  ];

  return (
    <section
      id="booking"
      aria-labelledby="booking-heading"
      className="relative z-10 w-full overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_85%_15%,rgba(29,78,216,0.18),transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_90%,rgba(28,25,23,0.5),transparent_55%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 overflow-x-clip px-6 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-24 lg:px-12">
        <ScrollSlideIn direction="left" className="relative">
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-blue-300">
            Free estimates · Residential &amp; commercial
          </p>

          <h2
            id="booking-heading"
            className="mt-6 font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-amber-50 sm:text-5xl lg:text-6xl"
          >
            Ready to protect{" "}
            <span className="italic text-blue-300">your pavement</span>?
          </h2>

          <p className="mt-7 max-w-xl text-base leading-8 text-neutral-200/90">
            Sealcoating, crack repair, patching, and line striping — scheduled
            around your property, explained clearly, and finished with a surface
            you can count on season after season.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <PrimaryButton href="/contact">Request an estimate</PrimaryButton>
            <SecondaryButton href="/gallery">View projects</SecondaryButton>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-200/90">
            <span>Replies within 24 hours</span>
            <span className="text-amber-600" aria-hidden="true">·</span>
            <span>Maryland &amp; the surrounding region</span>
            <span className="text-amber-600" aria-hidden="true">·</span>
            <span>Residential &amp; commercial</span>
          </p>
        </ScrollSlideIn>

        <ScrollSlideIn
          direction="right"
          delay={100}
          className="relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none"
        >
          {FRAME_LAYOUT.map((frame, idx) => (
            <FrameImage key={idx} image={frameImages[idx]} frame={frame} />
          ))}

          <div
            aria-hidden="true"
            className="absolute -top-2 right-2 z-40 rotate-[8deg] rounded-full bg-blue-300 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-amber-900 shadow-md shadow-amber-950/40"
          >
            est. {orgName.split(" ")[0].toLowerCase()}
          </div>
        </ScrollSlideIn>
      </div>
    </section>
  );
}
