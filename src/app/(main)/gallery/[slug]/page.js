import Link from "next/link";
import { notFound } from "next/navigation";

import GalleryPieceHeroImage from "@/components/gallery/GalleryPieceHeroImage";
import GalleryPieceNav from "@/components/gallery/GalleryPieceNav";
import GalleryPieceStory from "@/components/gallery/GalleryPieceStory";
import JsonLd from "@/components/seo/JsonLd";
import { orgLegalName, orgName } from "@/config";
import {
  getFirestoreGalleryProductBySlug,
  getFirestoreGalleryProducts,
  listFirestoreGallerySlugs,
} from "@/lib/gallery-firestore";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 120;

export async function generateStaticParams() {
  return listFirestoreGallerySlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getFirestoreGalleryProductBySlug(slug);
  if (!product) {
    return buildPageMetadata({
      title: "Gallery project not found",
      description: `Project not found in the ${orgLegalName} gallery.`,
      path: `/gallery/${slug}`,
      noIndex: true,
    });
  }

  const desc = String(product.description || product.title || "").trim();
  const imagePath =
    typeof product.image === "string" && product.image.trim()
      ? product.image
      : undefined;

  return buildPageMetadata({
    title: `${product.title} | Gallery`,
    description:
      desc.slice(0, 160) ||
      `${product.title}. Asphalt project gallery photo from ${orgLegalName}.`,
    path: `/gallery/${slug}`,
    image: imagePath,
    imageAlt: `${product.title} asphalt project by ${orgName}`,
    type: "article",
  });
}

function aspectRatioOf(product) {
  const w = Number(product?.imageWidth);
  const h = Number(product?.imageHeight);
  if (w > 0 && h > 0) return `${w} / ${h}`;
  return "3 / 4";
}

export default async function GalleryPiecePage({ params }) {
  const { slug } = await params;
  const product = await getFirestoreGalleryProductBySlug(slug);
  if (!product) notFound();

  const all = await getFirestoreGalleryProducts();
  const idx = all.findIndex((p) => p.slug === product.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <main className="relative z-10 w-full">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
          { name: product.title, path: `/gallery/${slug}` },
        ])}
      />
      <article className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32 lg:px-12">
        {/* Hero image — full bleed within the reading column */}
        {product.image ? (
          <GalleryPieceHeroImage
            src={product.image}
            alt={`${product.title}, ${orgName} asphalt project`}
            aspectRatio={aspectRatioOf(product)}
          />
        ) : (
          <figure className="relative">
            <div
              className="relative flex aspect-3/4 w-full items-center justify-center overflow-hidden bg-amber-950/60 text-sm uppercase tracking-[0.28em] text-amber-500"
            >
              No preview image
            </div>
          </figure>
        )}

        {/* Editorial intro: piece title + a quiet site/index breadcrumb */}
        <header className="mt-12 max-w-2xl sm:mt-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-blue-300/85">
            <Link
              href="/gallery"
              className="transition-colors hover:text-blue-100"
            >
              The Gallery
            </Link>
            <span className="mx-2 text-amber-600" aria-hidden="true">
              /
            </span>
            <span className="text-amber-400">{prev || next ? "A Story" : "Featured"}</span>
          </p>
          <h1 className="font-serif mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-amber-100 sm:text-5xl lg:text-6xl">
            {product.title}
          </h1>
        </header>

        {/* Story column — narrower than the image so the eye relaxes */}
        <section className="mt-14 max-w-3xl">
          <GalleryPieceStory
            description={product.description}
            title={product.title}
          />
        </section>

        {/* Quiet prev / next strip */}
        <GalleryPieceNav
          prev={prev ? { slug: prev.slug, title: prev.title } : null}
          next={next ? { slug: next.slug, title: next.title } : null}
        />
      </article>
    </main>
  );
}
