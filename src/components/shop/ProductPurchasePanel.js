"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Card from "@/components/ui/Card";
import SecondaryButton from "@/components/ui/SecondaryButton";
import SelectListbox from "@/components/ui/SelectListbox";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as overlayChrome from "@/lib/overlayChrome";
import { catalogMediumLabel, catalogVariantSizeRange } from "@/lib/catalogDisplay";
import { formatUsd } from "@/lib/money";
import { isLightThemeId } from "@/theme";

function variantKey(variant, index) {
  return String(variant?.id ?? variant?.catalogVariantId ?? `${variant?.name ?? "v"}-${index}`);
}

function displayPrice(product, selectedVariant) {
  if (selectedVariant?.priceUsd > 0) return formatUsd(selectedVariant.priceUsd);
  const min = Number(product?.minPriceUsd);
  const max = Number(product?.maxPriceUsd);
  if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > min) {
    return `${formatUsd(min)}–${formatUsd(max)}`;
  }
  return formatUsd(product.priceUsd);
}

export default function ProductPurchasePanel({ product }) {
  const themeId = useDocumentThemeId();
  const lightCardSurface = isLightThemeId(themeId);
  /** Theme accent `text-site-secondary` is pastel on light pages — too low-contrast on paper cards. */
  const labelClass = lightCardSurface ? "text-stone-600" : "text-site-secondary";
  const valueClass = lightCardSurface ? "text-stone-900" : "text-site-fg";
  const sectionBorder = lightCardSurface
    ? "border-t border-stone-300/55"
    : "border-t border-site-fg/10";
  const variants = useMemo(() => {
    if (Array.isArray(product?.variants) && product.variants.length > 0) {
      return product.variants;
    }
    if (product?.variantId) {
      return [
        {
          id: product.variantId,
          catalogVariantId: product.catalogVariantId ?? null,
          name: product.dimensions || "Default",
          sku: product.sku ?? null,
          priceUsd: Number(product.priceUsd),
        },
      ];
    }
    return [];
  }, [product]);

  const [selectedVariantKey, setSelectedVariantKey] = useState(
    variants.length ? variantKey(variants[0], 0) : null,
  );

  const selectedVariant = useMemo(() => {
    if (!variants.length || !selectedVariantKey) return null;
    const idx = variants.findIndex((v, i) => variantKey(v, i) === selectedVariantKey);
    return idx >= 0 ? variants[idx] : variants[0];
  }, [selectedVariantKey, variants]);

  const mediumLabel = catalogMediumLabel(product?.medium);
  const sizeSummary = catalogVariantSizeRange(product);

  const variantOptions = useMemo(() => {
    return variants.map((variant, index) => ({
      value: variantKey(variant, index),
      label: `${variant.name} · ${formatUsd(variant.priceUsd)}`,
    }));
  }, [variants]);

  const productForCart = useMemo(() => {
    if (!selectedVariant) return product;
    return {
      ...product,
      variantId: selectedVariant.id ?? product.variantId ?? null,
      catalogVariantId:
        selectedVariant.catalogVariantId ?? product.catalogVariantId ?? null,
      sku: selectedVariant.sku ?? product.sku ?? null,
      priceUsd:
        Number.isFinite(Number(selectedVariant.priceUsd)) && Number(selectedVariant.priceUsd) > 0
          ? Number(selectedVariant.priceUsd)
          : product.priceUsd,
      dimensions: selectedVariant.name || product.dimensions,
    };
  }, [product, selectedVariant]);

  return (
    <Card variant="inset" className="w-full" title="Price" titleTag="h4">
      <p
        className={`mt-3 font-serif text-4xl font-medium tabular-nums tracking-[-0.03em] sm:text-5xl ${valueClass}`}
      >
        {displayPrice(product, selectedVariant)}
      </p>

      <dl className={`mt-8 space-y-4 pt-8 text-sm ${sectionBorder}`}>
        {mediumLabel ? (
          <div className="flex justify-between gap-4">
            <dt className={labelClass}>Medium</dt>
            <dd className={`text-right ${valueClass}`}>{mediumLabel}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className={labelClass}>{variants.length > 1 ? "Sizes" : "Size"}</dt>
          <dd className={`text-right ${valueClass}`}>
            {variants.length > 1
              ? sizeSummary || selectedVariant?.name || product.dimensions
              : selectedVariant?.name || sizeSummary || product.dimensions}
          </dd>
        </div>
      </dl>

      {variants.length > 1 ? (
        <div className={`mt-6 pt-6 ${sectionBorder}`}>
          <SelectListbox
            label="Choose size"
            placeholder="Select a size"
            options={variantOptions}
            value={selectedVariantKey ?? ""}
            onChange={(v) => setSelectedVariantKey(v ? String(v) : null)}
            valueKey="value"
            labelKey="label"
            buttonClassName={overlayChrome.checkoutInputBase(lightCardSurface)}
          />
        </div>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <AddToCartButton product={productForCart} className="sm:min-w-[200px]" />
        <SecondaryButton
          href="/gallery"
          icon={<span>←</span>}
          className={overlayChrome.secondaryButtonLightOutline(lightCardSurface)}
        >
          Back to gallery
        </SecondaryButton>
      </div>
    </Card>
  );
}
