import { NextResponse } from "next/server";
import { normalizeStateCodeForPrintful } from "@/lib/shipping-address";

function normalizeRecipient(input = {}) {
  const country_code = String(
    input.countryCode || input.country || "US",
  ).toUpperCase();
  const stateRaw = input.state || "";
  return {
    country_code,
    state_code: normalizeStateCodeForPrintful(country_code, stateRaw),
    city: input.city || "",
    zip: input.postalCode || input.zip || "",
    address1: input.address1 || "",
  };
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const lines = Array.isArray(payload?.lines) ? payload.lines : [];
    const items = lines
      .map((line) => ({
        variant_id: Number(line.catalogVariantId ?? line.variantId),
        quantity: Math.max(1, Number(line.quantity || 1)),
      }))
      .filter((item) => Number.isFinite(item.variant_id) && item.variant_id > 0);

    if (items.length === 0) {
      return NextResponse.json({
        ok: true,
        shippingUsd: 0,
        source: "none",
      });
    }

    const recipient = normalizeRecipient(payload?.recipient);
    const hasAddress =
      String(recipient.address1 || "").trim() &&
      String(recipient.city || "").trim() &&
      String(recipient.state_code || "").trim() &&
      String(recipient.zip || "").trim();
    if (!hasAddress) {
      return NextResponse.json({
        ok: false,
        error: "Complete shipping address required for a quote.",
        shippingUsd: null,
      });
    }

    return NextResponse.json({
      ok: true,
      shippingUsd: 0,
      source: "demo",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to quote shipping.";
    return NextResponse.json(
      { ok: false, error: message, shippingUsd: null },
      { status: 200 },
    );
  }
}
