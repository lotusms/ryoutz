/**
 * Printful catalog uses coarse `medium` buckets ("Print", "Canvas") for filtering.
 * Storefront UI should not show those generic labels next to product images.
 */

const HIDDEN_MEDIUMS = new Set(["print", "canvas"]);

/** Small → large for common apparel / accessory sizes (Printful-style labels). */
const SIZE_ORDER = [
  "2xs",
  "xxs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "2xl",
  "xxl",
  "3xl",
  "xxxl",
  "4xl",
  "5xl",
  "6xl",
];

function sizeOrderIndex(token) {
  const key = String(token || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
  const oneSize = ["onesize", "os", "all"];
  if (oneSize.includes(key)) return 50;
  const idx = SIZE_ORDER.indexOf(key);
  return idx >= 0 ? idx : null;
}

/** Use segment before "/" so "S / Black" and "S / White" share size "S". */
export function primaryVariantSizeToken(label) {
  const raw = String(label || "").trim();
  if (!raw) return "";
  return raw.split("/")[0].trim();
}

function parseVolumeSortKey(label) {
  const m = String(label)
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*(oz|fl\.?\s*oz|ml|l)\b/i);
  if (!m) return null;
  return { n: Number.parseFloat(m[1]), unit: m[2].toLowerCase(), raw: label.trim() };
}

/**
 * Printful often puts the product title in `variant.name`; real sizes live in `variant.size`
 * or before " / " in the name. Never treat the product title as a size label.
 */
function variantSizeRawLabel(variant, productTitleLower) {
  const sz = String(variant?.size || "").trim();
  const nm = String(variant?.name || "").trim();
  const tryLabel = (raw) => {
    const token = primaryVariantSizeToken(raw);
    if (!token || token.toLowerCase() === productTitleLower) return "";
    return token;
  };
  if (sz) {
    const t = tryLabel(sz);
    if (t) return t;
  }
  if (nm) return tryLabel(nm);
  return "";
}

function dimensionsFallback(product) {
  const dim = String(product?.dimensions || "").trim();
  const title = String(product?.title || "").trim();
  if (!dim) return "";
  if (title && dim.toLowerCase() === title.toLowerCase()) return "";
  return dim;
}

function collectUniqueSizeTokens(product) {
  const titleLower = String(product?.title || "")
    .trim()
    .toLowerCase();
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const tokens = [];
  for (const v of variants) {
    const t = variantSizeRawLabel(v, titleLower);
    if (!t) continue;
    tokens.push(t);
  }
  const seen = new Set();
  const unique = [];
  for (const t of tokens) {
    const norm = t.toLowerCase();
    if (!seen.has(norm)) {
      seen.add(norm);
      unique.push(t);
    }
  }
  return unique;
}

function sortSizeTokensForDisplay(tokens) {
  if (tokens.length <= 1) return tokens;
  const volKeys = tokens.map(parseVolumeSortKey);
  if (volKeys.every((k) => k !== null)) {
    return [...tokens].sort((a, b) => parseVolumeSortKey(a).n - parseVolumeSortKey(b).n);
  }
  return [...tokens].sort((a, b) => {
    const ia = sizeOrderIndex(primaryVariantSizeToken(a));
    const ib = sizeOrderIndex(primaryVariantSizeToken(b));
    if (ia != null && ib != null && ia !== ib) return ia - ib;
    if (ia != null && ib == null) return -1;
    if (ia == null && ib != null) return 1;
    return String(a).localeCompare(String(b), undefined, { sensitivity: "base" });
  });
}

/**
 * Human-readable size summary: one label, or `smallest – largest` when multiple distinct sizes.
 * Falls back to `product.dimensions` when variant list is missing (single-SKU products).
 */
export function catalogVariantSizeRange(product) {
  const tokens = collectUniqueSizeTokens(product);
  const sorted = sortSizeTokensForDisplay(tokens);
  if (sorted.length === 0) {
    return dimensionsFallback(product);
  }
  if (sorted.length === 1) {
    return sorted[0];
  }
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const a = primaryVariantSizeToken(first).toLowerCase();
  const b = primaryVariantSizeToken(last).toLowerCase();
  if (a === b) return first;
  return `${first} – ${last}`;
}

export function isGenericCatalogMedium(medium) {
  return HIDDEN_MEDIUMS.has(String(medium || "").trim().toLowerCase());
}

/** Eyebrow / category line: empty when medium is the generic Printful bucket. */
export function catalogMediumLabel(medium) {
  if (isGenericCatalogMedium(medium)) return "";
  return String(medium || "").trim();
}

/** Shop grid / PDP eyebrow: real medium, else size/range when Print/Canvas. */
export function catalogShopCardEyebrow(product) {
  const med = catalogMediumLabel(product?.medium);
  if (med) return med;
  return catalogVariantSizeRange(product);
}

/** PDP eyebrow: real medium only (no size-range fallback — sizes belong in the purchase panel). */
export function catalogProductEyebrow(product) {
  return catalogMediumLabel(product?.medium);
}

/**
 * Hero overlay: non-generic medium plus size / range when helpful.
 */
export function catalogMediumDimensionsLine(product) {
  const label = catalogMediumLabel(product?.medium);
  const sizePart = catalogVariantSizeRange(product);
  if (label && sizePart) return `${label} • ${sizePart}`;
  if (sizePart) return sizePart;
  if (label) return label;
  return "—";
}
