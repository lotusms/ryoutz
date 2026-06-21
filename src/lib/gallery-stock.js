/**
 * Placeholder gallery for testing — **bundled files first** in
 * `public/images/gallery/stock` (self-hosted, always available).
 *
 * Optional: set `PEXELS_API_KEY` to append fresh search results from Pexels.
 * @see https://www.pexels.com/api/
 */
import { unstable_cache } from "next/cache";

import {
  applyCatalogMerchandising,
  loadCatalogMerchandisingState,
} from "@/lib/catalog-merchandising";
import { getRawBundledStockPiecesSync } from "@/lib/gallery-local";
import { displayTitleFromImageFilename } from "@/lib/image-filename-display-title";

const PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search";
const CACHE_SECONDS = 60 * 60 * 6;

const STOCK_SEARCHES = [
  { query: "asphalt parking lot", perPage: 2, medium: "Parking lot" },
  { query: "paved driveway", perPage: 2, medium: "Driveway" },
  { query: "road pavement", perPage: 2, medium: "Road paving" },
];

/** Verified remote fallbacks — only if bundled folder is missing (should not happen in prod). */
const REMOTE_PEXELS_FALLBACK = [
  { id: 3952126, title: "Parking lot aerial", medium: "Parking lot" },
  { id: 2219024, title: "Fresh asphalt road", medium: "Road paving" },
  { id: 3754300, title: "Residential driveway", medium: "Driveway" },
  { id: 1642125, title: "Road construction", medium: "Construction" },
  { id: 386026, title: "Highway markings", medium: "Line striping" },
  { id: 1271619, title: "Urban street", medium: "Street paving" },
  { id: 1438765, title: "Empty highway", medium: "Highway" },
];

function pexelsImageUrl(photoId) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1920`;
}

function shapeBundledPiece(piece) {
  return {
    ...piece,
    stockSource: "bundled",
    description:
      piece.description ||
      "Placeholder project photo — replace with your own work in public/images/gallery when ready.",
  };
}

function shapeRemotePexelsPhoto(photo, medium) {
  const id = Number(photo?.id);
  const slug = `stock-${id}`;
  const alt = String(photo?.alt || "").trim();
  const title =
    alt.length > 2
      ? displayTitleFromImageFilename(alt.replace(/\s+/g, "-")) || alt
      : medium;
  const photographer = String(photo?.photographer || "Pexels").trim();
  const pexelsUrl = String(photo?.url || `https://www.pexels.com/photo/${id}/`).trim();

  return {
    id: slug,
    slug,
    title,
    description: `Stock placeholder. Photo by ${photographer} on Pexels (${pexelsUrl}).`,
    image:
      String(photo?.src?.large2x || photo?.src?.large || "").trim() ||
      pexelsImageUrl(id),
    imageWidth: Number(photo?.width) > 0 ? Number(photo.width) : null,
    imageHeight: Number(photo?.height) > 0 ? Number(photo.height) : null,
    medium,
    dimensions: "",
    variants: [],
    printfulProductId: null,
    catalogUpdatedAt: id,
    stockSource: "pexels",
    stockPhotoId: id,
  };
}

function shapeStaticRemote(entry) {
  const slug = `stock-${entry.id}`;
  return {
    id: slug,
    slug,
    title: entry.title,
    description: `Stock placeholder from Pexels (photo ${entry.id}). Replace with your own project images.`,
    image: pexelsImageUrl(entry.id),
    imageWidth: null,
    imageHeight: null,
    medium: entry.medium,
    dimensions: "",
    variants: [],
    printfulProductId: null,
    catalogUpdatedAt: entry.id,
    stockSource: "pexels",
    stockPhotoId: entry.id,
  };
}

async function searchPexels(apiKey, query, perPage) {
  const url = new URL(PEXELS_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, {
    headers: { Authorization: apiKey },
    next: { revalidate: CACHE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Pexels search failed (${res.status})`);
  }

  const data = await res.json();
  return Array.isArray(data?.photos) ? data.photos : [];
}

function mergeUniquePieces(primary, extra) {
  const seen = new Set(primary.map((p) => p.slug));
  const merged = [...primary];
  for (const piece of extra) {
    if (!piece?.slug || seen.has(piece.slug)) continue;
    seen.add(piece.slug);
    merged.push(piece);
  }
  return merged;
}

async function fetchStockPiecesRaw() {
  const bundled = getRawBundledStockPiecesSync().map(shapeBundledPiece);

  if (bundled.length > 0) {
    const apiKey = process.env.PEXELS_API_KEY?.trim();
    if (!apiKey) {
      return bundled;
    }

    const seen = new Set(bundled.map((p) => p.stockPhotoId).filter(Boolean));
    const extras = [];

    for (const { query, perPage, medium } of STOCK_SEARCHES) {
      try {
        const photos = await searchPexels(apiKey, query, perPage);
        for (const photo of photos) {
          const id = Number(photo?.id);
          if (!id || seen.has(id)) continue;
          seen.add(id);
          extras.push(shapeRemotePexelsPhoto(photo, medium));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[gallery-stock] Pexels search "${query}" skipped: ${msg}`);
      }
    }

    return mergeUniquePieces(bundled, extras);
  }

  console.warn(
    "[gallery-stock] public/images/gallery/stock is empty — add bundled files under public/images/gallery/stock.",
  );
  return [];
}

const getCachedStockPiecesRaw = unstable_cache(
  fetchStockPiecesRaw,
  ["gallery-stock-bundled-v3"],
  { revalidate: CACHE_SECONDS },
);

/** Stock placeholder gallery rows (with merchandising defaults applied). */
export async function getStockGalleryProducts() {
  const raw = await getCachedStockPiecesRaw();
  const state = await loadCatalogMerchandisingState();
  const products = applyCatalogMerchandising(raw, state);

  if (products.length === 0) {
    console.error(
      "[gallery-stock] No gallery images available — add files to public/images/gallery/stock",
    );
  }

  return products;
}

/** @returns {boolean} */
export function isStockGalleryProduct(product) {
  return Boolean(
    product?.stockSource === "bundled" ||
      product?.stockSource === "pexels" ||
      String(product?.slug || "").startsWith("stock-"),
  );
}
