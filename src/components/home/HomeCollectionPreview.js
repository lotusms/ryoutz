"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchCatalogProductList } from "@/lib/catalogClientFetch";
import { sortCatalogByRecency } from "@/lib/catalogSort";
import { catalogVariantSizeRange } from "@/lib/catalogDisplay";
import { orgName } from "@/config";
import SecondaryButton from "@/components/ui/SecondaryButton";
import CoverImageFrame from "@/components/ui/CoverImageFrame";
import ScrollSlideIn from "@/components/ui/ScrollSlideIn";
import ScrollZoomIn from "@/components/ui/ScrollZoomIn";

const SKELETON_CARD_COUNT = 6;
/** Per-card cascade step (ms) and cap so long galleries don't introduce awkward waits. */
const CARD_CASCADE_STEP_MS = 60;
const CARD_CASCADE_MAX_MS = 600;
import { linkButtonClasses, linkButtonClassesLight } from "@/components/ui/LinkButton";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

/** @param {{ imageWidth?: number; imageHeight?: number }} product */
function productImageHeightOverWidth(product) {
  const w = Number(product?.imageWidth);
  const h = Number(product?.imageHeight);
  if (w > 0 && h > 0) return h / w;
  return 1.25;
}

/**
 * Interleave taller vs wider pieces before masonry placement so reading order and columns
 * don’t stack identical aspect ratios (e.g. all portraits in one band).
 */
function interleaveByAspectRatio(products) {
  if (!Array.isArray(products) || products.length <= 1) return [...products];
  const portrait = [];
  const landscape = [];
  for (const p of products) {
    if (productImageHeightOverWidth(p) >= 1) portrait.push(p);
    else landscape.push(p);
  }
  const out = [];
  let pi = 0;
  let li = 0;
  let takePortrait = portrait.length >= landscape.length;
  while (pi < portrait.length || li < landscape.length) {
    if (takePortrait && pi < portrait.length) {
      out.push(portrait[pi++]);
    } else if (!takePortrait && li < landscape.length) {
      out.push(landscape[li++]);
    } else if (pi < portrait.length) {
      out.push(portrait[pi++]);
    } else {
      out.push(landscape[li++]);
    }
    takePortrait = !takePortrait;
  }
  return out;
}

function CollectionSkeletonCard({ delay = 0 }) {
  const h = delay % 2 === 0 ? "min-h-[18rem]" : "min-h-[24rem]";
  return (
    <div
      className="w-full overflow-hidden rounded-4xl border-2 border-stone-700/35 bg-stone-900/40 shadow-lg shadow-stone-950/35 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`border-b border-white/5 bg-linear-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 ${h}`}
      />
      <div className="space-y-3 px-5 py-4">
        <div className="h-3 w-24 rounded-full bg-slate-700/70" />
        <div className="h-5 w-4/5 rounded-full bg-slate-600/60" />
      </div>
    </div>
  );
}

function CollectionProductCard({ product }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const showLightImageWell =
    String(product?.medium || "").toLowerCase().includes("print") ||
    String(product?.medium || "").toLowerCase().includes("tapestry");
  return (
    <Link
      href={`/gallery/${product.slug}`}
      className="group block w-full overflow-hidden rounded-4xl border-2 border-stone-700/35 bg-stone-950/45 shadow-lg shadow-stone-950/35 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-stone-950/45"
    >
      <div className="relative">
        <CoverImageFrame
          src={product.image}
          alt={`${product.title} from ${orgName}`}
          imageWidth={product.imageWidth}
          imageHeight={product.imageHeight}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          frameLayout="masonry"
          imageZoom={false}
          frameClassName={
            showLightImageWell
              ? "relative w-full overflow-hidden bg-stone-100"
              : "relative w-full overflow-hidden bg-site-bg"
          }
          scrim="card"
          galleryProtected
          galleryWatermarkSize="md"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6">
          <h3 className="font-serif text-xl font-medium tracking-[-0.02em] text-stone-100">
            {product.title}
          </h3>
          <div className="flex items-end justify-between gap-4">
            <p
              className={`text-sm ${light ? "text-slate-800" : "text-slate-400"}`}
            >
              {catalogVariantSizeRange(product) || "—"}
            </p>
            <span
              className={light ? linkButtonClassesLight : linkButtonClasses}
              aria-hidden="true"
            >
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomeCollectionPreview({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [columnCount, setColumnCount] = useState(1);

  /** Re-sync when the server passes a new list (slug + image URL identity). */
  const previewKey = useMemo(
    () =>
      Array.isArray(initialProducts)
        ? initialProducts
            .map((p) => `${String(p.slug ?? "")}\0${String(p.image ?? "")}`)
            .join("|")
        : "",
    [initialProducts],
  );

  useEffect(() => {
    const next = Array.isArray(initialProducts) ? initialProducts : [];
    setProducts(next);
    setLoading(next.length === 0);
  }, [previewKey, initialProducts]);

  useEffect(() => {
    const serverSentRows =
      Array.isArray(initialProducts) && initialProducts.length > 0;
    if (serverSentRows) return undefined;
    let active = true;
    async function load() {
      try {
        const list = await fetchCatalogProductList({ context: "home-collection" });
        if (!active) return;
        setProducts(sortCatalogByRecency(list));
      } catch {
        if (!active) return;
        setProducts((prev) => (prev.length > 0 ? prev : []));
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `previewKey` gates fetch; omitting `initialProducts` avoids RSC reference reset bugs.
  }, [previewKey]);

  useEffect(() => {
    function updateColumnCount() {
      const width = window.innerWidth;
      if (width >= 1024) setColumnCount(3);
      else if (width >= 640) setColumnCount(2);
      else setColumnCount(1);
    }
    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const orderedProducts = useMemo(
    () => interleaveByAspectRatio(products),
    [products],
  );

  const workColumns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    const heights = Array.from({ length: columnCount }, () => 0);

    orderedProducts.forEach((product, globalIndex) => {
      const ratio = productImageHeightOverWidth(product);
      const estimatedHeight = ratio + 0.42;
      let target = 0;
      for (let i = 1; i < heights.length; i += 1) {
        if (heights[i] < heights[target]) target = i;
      }
      cols[target].push({ product, globalIndex });
      heights[target] += estimatedHeight;
    });
    return cols;
  }, [orderedProducts, columnCount]);

  const gridClass =
    columnCount >= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : columnCount >= 2
        ? "sm:grid-cols-2"
        : "grid-cols-1";

  const headerBlock = (
    <>
      <div className="mb-10 flex flex-col gap-6 overflow-x-clip">
        <div>
          <ScrollSlideIn
            as="p"
            direction="left"
            className="text-xs uppercase tracking-[0.32em] text-slate-400"
          >
            Heart-led work
          </ScrollSlideIn>
          <ScrollSlideIn
            as="h2"
            direction="left"
            delay={120}
            className="font-serif mt-4 max-w-3xl text-3xl font-medium tracking-[-0.02em] text-stone-100 sm:text-5xl leading-[1.1]"
          >
            For the moments you&apos;ll already miss
          </ScrollSlideIn>
        </div>
        <ScrollSlideIn
          as="p"
          direction="right"
          delay={250}
          className="text-sm leading-7 text-stone-200/85"
        >
          The celebrations here belong to couples who trusted {orgName} {" "}with what they already knew they&apos;d want to hold onto, the breath before the aisle, a parent&apos;s grip, the seconds no one rehearses. Wedding and portrait photography, offered with patience instead of staging, for people who feel the weight of a day long before the last dance. When you&apos;re ready, the full gallery carries more of those stories, each frame another invitation to imagine yours beside them.
        </ScrollSlideIn>
      </div>
    </>
  );

  if (loading) {
    const skeletonPlaceholders = Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => i);
    return (
      <section
        id="collection"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 sm:px-10 lg:px-12"
      >
        {headerBlock}
        <div className={`grid gap-6 ${gridClass}`}>
          {Array.from({ length: columnCount }, (_, colIdx) => (
            <div key={`sk-col-${colIdx}`} className="space-y-6">
              {skeletonPlaceholders
                .filter((_, i) => i % columnCount === colIdx)
                .map((slot) => (
                  <CollectionSkeletonCard key={slot} delay={slot * 50} />
                ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section
        id="collection"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 sm:px-10 lg:px-12"
      >
        {headerBlock}
        <div className="rounded-3xl border border-stone-700/45 bg-stone-900/35 px-6 py-12 text-center text-stone-300/90">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Gallery
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7">
            No images are in the Firestore{" "}
            <code className="rounded bg-stone-800/80 px-1.5 py-0.5 text-xs">gallery</code>{" "}
            collection yet, or they are hidden. Upload images under the{" "}
            <code className="rounded bg-stone-800/80 px-1.5 py-0.5 text-xs">gallery/</code>{" "}
            prefix in Firebase Storage, then run{" "}
            <code className="rounded bg-stone-800/80 px-1.5 py-0.5 text-xs">pnpm firebase:seed:gallery</code>{" "}
            locally (with Admin credentials in{" "}
            <code className="rounded bg-stone-800/80 px-1.5 py-0.5 text-xs">.env.local</code>
            ).
          </p>
          <Link
            href="/gallery"
            className="mt-6 inline-flex rounded-full border border-stone-500/60 bg-stone-900/50 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-amber-300/45 hover:text-amber-100"
          >
            View gallery
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      id="collection"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 sm:px-10 lg:px-12"
    >
      {headerBlock}
      <div className={`grid gap-6 ${gridClass}`}>
        {workColumns.map((column, colIdx) => (
          <div key={`collection-col-${colIdx}`} className="space-y-6">
            {column.map(({ product, globalIndex }, rowIdx) => (
              <ScrollZoomIn
                key={product.id ?? `${product.slug}-${colIdx}-${rowIdx}`}
                delay={Math.min(globalIndex * CARD_CASCADE_STEP_MS, CARD_CASCADE_MAX_MS)}
              >
                <CollectionProductCard product={product} />
              </ScrollZoomIn>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <SecondaryButton
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition"
        >
          See more in the gallery
          <span aria-hidden="true">→</span>
        </SecondaryButton>
      </div>
    </section>
  );
}
