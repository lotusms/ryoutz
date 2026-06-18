import { NextResponse } from "next/server";
import { pickPortraitHeroProducts } from "@/lib/catalogSort";
import {
  getFirestoreGalleryProducts,
  selectHomeCollectionPreviewProducts,
} from "@/lib/gallery-firestore";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
};

function stripMerchandisingMeta(product) {
  const { featured, onHomeSlider, catalogAvailable, ...rest } = product;
  return rest;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context") || "gallery";

    const products = await getFirestoreGalleryProducts();
    let list = products;

    if (context === "home-collection") {
      list = selectHomeCollectionPreviewProducts(products, 6);
    } else if (context === "home-hero") {
      list = pickPortraitHeroProducts(products.filter((p) => p.onHomeSlider), 8);
    }

    const out = list.map(stripMerchandisingMeta);
    return NextResponse.json(
      {
        ok: true,
        count: out.length,
        products: out,
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to load catalog.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
