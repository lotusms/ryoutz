"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ArtworkImageScrim from "@/components/ui/ArtworkImageScrim";
import { ARTWORK_MAT_INNER, ARTWORK_MAT_OUTER } from "@/components/ui/artworkMatClasses";
import LinkButton from "@/components/ui/LinkButton";
import { orgName } from "@/config";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { catalogMediumDimensionsLine } from "@/lib/catalogDisplay";
import { isLightThemeId } from "@/theme";

const ROTATE_MS = 8000;
/** Crossfade between slides (opacity on overlapping layers). */
const SLIDE_FADE_MS = 2500;

function formatUsd(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Display price: range when available, else single price. */
function heroPriceLabel(product) {
  const min = Number(product?.minPriceUsd);
  const max = Number(product?.maxPriceUsd);
  if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > min) {
    return `${formatUsd(min)}–${formatUsd(max)}`;
  }
  return formatUsd(product?.priceUsd ?? 0);
}

/** Rich alt for hero mockups: title, size summary, price, brand. */
function heroImageAlt(product) {
  const title = String(product?.title || "Fitness apparel").trim();
  const detail = catalogMediumDimensionsLine(product);
  const price = heroPriceLabel(product);
  return `Fitness apparel product: ${title}. ${detail}. From ${price}. ${orgName}.`;
}

export default function HomeHeroArtRotator({ products }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const [index, setIndex] = useState(0);
  const n = products.length;

  useEffect(() => {
    if (n <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [n]);

  const current = products[index];
  if (!current) return null;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border-2 border-amber-600/40 bg-site-bg shadow-2xl shadow-amber-950/40 transition duration-500 hover:ring-blue-400/35 hover:shadow-amber-950/50"
    >
      {/* Mat + inner aperture; fixed portrait; mockup PNG zoom fills aperture. */}
      <div className={ARTWORK_MAT_OUTER}>
        <div className={ARTWORK_MAT_INNER}>
          <div className="relative aspect-2/3 w-full overflow-hidden bg-site-bg">
            {products.map((p, idx) => (
              <div
                key={p.id}
                className={`absolute inset-0 overflow-hidden transition-opacity ease-in-out ${
                  idx === index
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
                aria-hidden={idx !== index}
                style={{ transitionDuration: `${SLIDE_FADE_MS}ms` }}
              >
                {p.image?.trim() ? (
                  <div className="relative h-full w-full origin-center scale-[1.14]">
                    <Image
                      src={p.image}
                      alt={heroImageAlt(p)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      quality={82}
                      priority={idx === 0}
                      fetchPriority={idx === 0 ? "high" : "low"}
                      loading={idx > 0 ? "lazy" : undefined}
                      className="object-cover object-center"
                    />
                    <ArtworkImageScrim variant="hero" />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-amber-500">
                    No preview image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
          Featured product
        </p>
        <h2 className="font-serif mt-3 text-2xl font-medium tracking-[-0.02em] text-amber-100 sm:text-3xl"> {current.title} </h2>
        
        
        <div className=" flex items-end justify-between gap-6">
          <p
            className={`mt-1 text-sm ${light ? "text-slate-800" : "text-slate-400"}`}
          >
            {catalogMediumDimensionsLine(current)}
          </p>
          <LinkButton href={`/gallery/${current.slug}`}>View</LinkButton>
        </div>
      </div>
    </div>
  );
}
