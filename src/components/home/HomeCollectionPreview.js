"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchCatalogProductList } from "@/lib/catalogClientFetch";
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

const SECTION_SHELL =
  "relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 pt-16 sm:px-10 sm:pt-20 lg:px-12 lg:pt-24";
import { linkButtonClasses, linkButtonClassesLight } from "@/components/ui/LinkButton";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

import { packMasonryColumns } from "@/lib/masonry-layout";

function CollectionSkeletonCard({ delay = 0 }) {
  const h = delay % 2 === 0 ? "min-h-[18rem]" : "min-h-[24rem]";
  return (
    <div
      className="w-full overflow-hidden rounded-4xl border-2 border-slate-700/35 bg-slate-900/40 shadow-lg shadow-slate-950/35 animate-pulse"
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
      className="group block w-full overflow-hidden rounded-4xl border-2 border-slate-700/35 bg-slate-950/45 shadow-lg shadow-slate-950/35 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-slate-950/45"
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
              ? "relative w-full overflow-hidden bg-amber-100"
              : "relative w-full overflow-hidden bg-slate-950"
          }
          scrim="card"
          galleryProtected
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6">
          <h3 className="font-serif text-xl font-medium tracking-[-0.02em] text-slate-100">
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
        setProducts(list);
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

  const workColumns = useMemo(() => {
    const cols = packMasonryColumns(products, columnCount);
    let globalIndex = 0;
    return cols.map((column) =>
      column.map((product) => {
        const entry = { product, globalIndex };
        globalIndex += 1;
        return entry;
      }),
    );
  }, [products, columnCount]);

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
            className="text-xs font-serif font-bold uppercase tracking-[0.32em] text-blue-400"
          >
            Recent projects
          </ScrollSlideIn>
          <ScrollSlideIn
            as="h2"
            direction="left"
            delay={120}
            className="font-serif mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.02em] text-slate-100 sm:text-5xl leading-[1.1] capitalize"
          >
            Work that holds up
          </ScrollSlideIn>
        </div>
        <ScrollSlideIn
          as="p"
          direction="right"
          delay={250}
          className="text-sm leading-7 text-neutral-200/90"
        >
          Driveways, parking lots, crack sealing, and full resurfacing — the kind
          of jobs where prep, materials, and finish matter. Browse recent projects
          from {orgName}, then tap any image to see the scope and results up close.
        </ScrollSlideIn>
      </div>
    </>
  );

  if (loading) {
    const skeletonPlaceholders = Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => i);
    return (
      <section
        id="collection"
        className={SECTION_SHELL}
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
        className={SECTION_SHELL}
      >
        {headerBlock}
        <div className="rounded-3xl border border-slate-700/45 bg-slate-900/35 px-6 py-12 text-center text-slate-300/90">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Gallery
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7">
            No project photos yet. Add images to{" "}
            <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs">
              public/images/gallery
            </code>
            , set{" "}
            <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs">
              GALLERY_SOURCE=stock
            </code>{" "}
            for Pexels placeholders, or add a free{" "}
            <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs">
              PEXELS_API_KEY
            </code>
            .
          </p>
          <Link
            href="/gallery"
            className="mt-6 inline-flex rounded-full border border-slate-500/60 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-300/45 hover:text-blue-100"
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
      className={SECTION_SHELL}
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
