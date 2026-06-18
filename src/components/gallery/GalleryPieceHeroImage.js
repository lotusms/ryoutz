"use client";

import Image from "next/image";

import GalleryImageWell from "@/components/gallery/GalleryImageWell";

/**
 * Full-width gallery piece hero with watermark and download discouragement.
 *
 * @param {{
 *   src: string;
 *   alt: string;
 *   aspectRatio: string;
 * }} props
 */
export default function GalleryPieceHeroImage({ src, alt, aspectRatio }) {
  return (
    <figure className="relative">
      <GalleryImageWell watermarkSize="lg">
        <div
          className="relative w-full overflow-hidden bg-stone-950/60"
          style={{ aspectRatio }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            draggable={false}
            className="pointer-events-none object-contain select-none"
          />
        </div>
      </GalleryImageWell>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
