"use client";

import Image from "next/image";
import GalleryImageWell from "@/components/gallery/GalleryImageWell";
import ArtworkImageScrim from "@/components/ui/ArtworkImageScrim";
import { ARTWORK_MAT_INNER, ARTWORK_MAT_OUTER } from "@/components/ui/artworkMatClasses";

function aspectStyle(imageWidth, imageHeight, fallbackAspectRatio) {
  const w = Number(imageWidth);
  const h = Number(imageHeight);
  if (w > 0 && h > 0) {
    return { aspectRatio: `${w} / ${h}` };
  }
  return { aspectRatio: fallbackAspectRatio };
}

/** Dimensions for `next/image` width/height (ratio only when displayed as w-full h-auto). */
function intrinsicSize(imageWidth, imageHeight, fallbackAspectRatio) {
  const w = Number(imageWidth);
  const h = Number(imageHeight);
  if (w > 0 && h > 0) {
    return { width: Math.round(w), height: Math.round(h) };
  }
  const raw = String(fallbackAspectRatio).trim();
  const parts = raw.split("/").map((s) => Number(s.trim()));
  if (parts.length === 2 && parts.every((n) => Number.isFinite(n) && n > 0)) {
    const [a, b] = parts;
    return { width: Math.round(100 * a), height: Math.round(100 * b) };
  }
  return { width: 2, height: 3 };
}

export default function CoverImageFrame({
  src,
  alt,
  imageWidth,
  imageHeight,
  sizes,
  fallbackAspectRatio = "2 / 3",
  /**
   * `fill` — fixed aspect box + `fill` image (hero / legacy).
   * `masonry` — full column width, height from image aspect (Printful-style; no side letterboxing).
   */
  frameLayout = "fill",
  /** `contain` shows the full image inside the aspect box; `cover` fills and may crop. Ignored when `frameLayout="masonry"`. */
  imageFit = "cover",
  /** Catalog tiles: set false to avoid zoom crop inside the frame. */
  imageZoom = true,
  zoomClass = "scale-[1.14]",
  hoverZoomClass = "group-hover:scale-[1.2]",
  frameClassName = "relative w-full overflow-hidden bg-slate-950",
  secondaryMat = true,
  /**
   * Scrim inside the image well only (never over mat rings).
   * `inner` — subtle well-only fade; `card` — catalog tiles; `hero` — home hero rotator.
   */
  scrim = "none",
  /** Next/Image LCP hint for above-the-fold PDP / hero tiles. */
  priority = false,
  /** Override lazy loading — use `"eager"` for small above-the-fold grids. */
  loading: loadingProp,
  /** 1–100; lower = smaller files (default 80 for catalog/hero balance). */
  quality = 80,
  matOuterClassName = "",
  matInnerClassName = "",
  /** Right-click / drag discouragement for gallery surfaces */
  galleryProtected = false,
}) {
  const zoomActive = imageZoom ? `${zoomClass} ${hoverZoomClass}` : "scale-100 group-hover:scale-100";
  const objectClass =
    imageFit === "contain" ? "object-contain object-center" : "object-cover object-center";
  const protectedImageClass = galleryProtected
    ? `${objectClass} pointer-events-none select-none`
    : objectClass;

  const { width: intrinsicW, height: intrinsicH } = intrinsicSize(
    imageWidth,
    imageHeight,
    fallbackAspectRatio,
  );
  const loading = loadingProp ?? (priority ? "eager" : "lazy");

  const imageWellInner =
    frameLayout === "masonry" ? (
      <div className={`${frameClassName} block`}>
        <div className="relative w-full overflow-hidden">
          <div
            className={`relative w-full origin-center transition duration-700 ${zoomActive}`}
          >
            <Image
              src={src}
              alt={alt}
              width={intrinsicW}
              height={intrinsicH}
              sizes={sizes}
              quality={quality}
              priority={priority}
              loading={loading}
              fetchPriority={priority ? "high" : "auto"}
              draggable={galleryProtected ? false : undefined}
              className={
                galleryProtected
                  ? "pointer-events-none h-auto w-full max-w-full select-none align-middle"
                  : "h-auto w-full max-w-full align-middle"
              }
            />
            <ArtworkImageScrim variant={scrim} />
          </div>
        </div>
      </div>
    ) : (
      <div
        className={frameClassName}
        style={aspectStyle(imageWidth, imageHeight, fallbackAspectRatio)}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`relative h-full w-full origin-center transition duration-700 ${zoomActive}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              quality={quality}
              priority={priority}
              loading={loading}
              fetchPriority={priority ? "high" : "auto"}
              draggable={galleryProtected ? false : undefined}
              className={protectedImageClass}
            />
            <ArtworkImageScrim variant={scrim} />
          </div>
        </div>
      </div>
    );

  const core = galleryProtected ? (
    <GalleryImageWell>{imageWellInner}</GalleryImageWell>
  ) : (
    imageWellInner
  );

  if (!secondaryMat) return core;

  return (
    <div className={`${ARTWORK_MAT_OUTER} ${matOuterClassName}`.trim()}>
      <div className={`${ARTWORK_MAT_INNER} ${matInnerClassName}`.trim()}>
        {core}
      </div>
    </div>
  );
}
