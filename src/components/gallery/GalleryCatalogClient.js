"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import CoverImageFrame from "@/components/ui/CoverImageFrame";
import { orgName } from "@/config";
import { fetchCatalogProductList } from "@/lib/catalogClientFetch";
import { packMasonryColumns } from "@/lib/masonry-layout";

function GalleryCard({ product, priority = false }) {
  const showLightImageWell =
    String(product?.medium || "").toLowerCase().includes("print") ||
    String(product?.medium || "").toLowerCase().includes("tapestry");
  return (
    <Link href={`/gallery/${product.slug}`} className="group block w-full">
      <div className="relative rounded-4xl shadow-lg shadow-slate-950/35 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/45">
        <CoverImageFrame
          src={product.image}
          alt={`${product.title} — ${orgName}`}
          imageWidth={product.imageWidth}
          imageHeight={product.imageHeight}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          frameLayout="fill"
          priority={priority}
          loading="eager"
          imageZoom={false}
          frameClassName={
            showLightImageWell
              ? "relative w-full overflow-hidden bg-amber-100"
              : "relative w-full overflow-hidden bg-slate-950"
          }
          scrim="card"
          galleryProtected
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
          <p className="font-serif text-xl font-medium tracking-[-0.02em] text-slate-100">
            {product.title}
          </p>
        </div>
      </div>
    </Link>
  );
}

function GallerySkeleton({ delay = 0 }) {
  const heightClass = delay % 2 === 0 ? "h-[22rem]" : "h-[30rem]";
  return (
    <div
      className="w-full overflow-hidden rounded-4xl border-2 border-slate-700/35 bg-slate-900/40 shadow-lg shadow-slate-950/35 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`relative overflow-hidden border-b border-white/5 bg-linear-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60 ${heightClass}`}
      />
      <div className="px-5 py-4">
        <div className="h-5 w-4/5 rounded-full bg-slate-600/60" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-4xl border-2 border-slate-700/40 bg-linear-to-br from-slate-900/60 via-slate-950/60 to-slate-900/45 p-10 text-center shadow-2xl shadow-slate-950/40">
      <div className="pointer-events-none absolute -left-10 -top-20 h-44 w-44 rounded-full bg-blue-300/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-20 h-52 w-52 rounded-full bg-sky-300/10 blur-3xl" />
      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Gallery</p>
      <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-slate-100 sm:text-4xl">
        New work is on the way
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300/90">
        No project photos yet. Set{" "}
        <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs">
          GALLERY_SOURCE=stock
        </code>{" "}
        in{" "}
        <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs">.env.local</code>{" "}
        for free Pexels placeholders, add your own files under{" "}
        <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs">
          public/images/gallery
        </code>
        , or configure Firebase.
      </p>
      <Link
        href="/contact"
        className="mt-8 flex w-full items-center justify-center rounded-full border border-slate-500/60 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-300/45 hover:text-blue-100"
      >
        Get in touch
      </Link>
    </div>
  );
}

export default function GalleryCatalogClient({ initialProducts }) {
  const initial = Array.isArray(initialProducts) ? initialProducts : [];
  const [products, setProducts] = useState(initial);
  const [loading, setLoading] = useState(() => initial.length === 0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (initial.length > 0) {
      setLoading(false);
    }
  }, [initial.length]);

  useEffect(() => {
    if (loading) return;
    setVisible(true);
  }, [loading]);

  const skeletons = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    /** Keep these breakpoints in sync with `gridColumnsClass` below
     * (Tailwind: sm=640, lg=1024, xl=1280). */
    function updateColumnCount() {
      const width = window.innerWidth;
      if (width >= 1280) {
        setColumnCount(4);
      } else if (width >= 1024) {
        setColumnCount(3);
      } else if (width >= 640) {
        setColumnCount(2);
      } else {
        setColumnCount(1);
      }
    }

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const gridColumnsClass =
    "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const productColumns = useMemo(
    () => packMasonryColumns(products, columnCount),
    [products, columnCount],
  );

  const skeletonColumns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    skeletons.forEach((i, idx) => {
      cols[idx % columnCount].push(i);
    });
    return cols;
  }, [skeletons, columnCount]);

  if (loading) {
    return (
      <div className={gridColumnsClass}>
        {skeletonColumns.map((column, colIdx) => (
          <div key={`skeleton-col-${colIdx}`} className="space-y-6">
            {column.map((i) => (
              <GallerySkeleton key={i} delay={i * 50} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`transition-transform duration-700 ease-out ${
        visible ? "translate-y-0" : "translate-y-2"
      }`}
    >
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={gridColumnsClass}>
          {productColumns.map((column, colIdx) => (
            <div key={`product-col-${colIdx}`} className="space-y-6">
              {column.map((p, rowIdx) => (
                <GalleryCard
                  key={p.id}
                  product={p}
                  priority={rowIdx === 0}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
