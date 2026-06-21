/** Title/scrim block below image — keep in sync with card padding in gallery components. */
const TITLE_OVERLAY_RATIO = 0.42;

/** @param {{ imageWidth?: number; imageHeight?: number }} product */
export function productImageHeightOverWidth(product) {
  const w = Number(product?.imageWidth);
  const h = Number(product?.imageHeight);
  if (w > 0 && h > 0) return h / w;
  return 1.25;
}

/** @param {{ imageWidth?: number; imageHeight?: number }} product */
export function estimatedMasonryHeight(product) {
  return productImageHeightOverWidth(product) + TITLE_OVERLAY_RATIO;
}

/**
 * Interleave taller vs wider pieces before masonry placement so columns
 * don't stack identical aspect ratios in one band.
 */
export function interleaveByAspectRatio(products) {
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

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(items, seed) {
  const out = [...items];
  const rand = mulberry32(seed >>> 0);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function packingSeed(products) {
  let h = 2166136261;
  for (const p of products) {
    const s = String(p.slug ?? p.id ?? "");
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  return h >>> 0;
}

function packShortestColumn(products, columnCount) {
  const cols = Array.from({ length: columnCount }, () => []);
  const heights = Array.from({ length: columnCount }, () => 0);

  for (const product of products) {
    let target = 0;
    for (let i = 1; i < columnCount; i += 1) {
      if (heights[i] < heights[target]) target = i;
    }
    cols[target].push(product);
    heights[target] += estimatedMasonryHeight(product);
  }

  return cols;
}

function columnHeightSpread(columns) {
  const heights = columns.map((col) =>
    col.reduce((sum, product) => sum + estimatedMasonryHeight(product), 0),
  );
  if (heights.length === 0) return 0;
  return Math.max(...heights) - Math.min(...heights);
}

/**
 * Assign products to masonry columns with randomized order and balanced heights.
 * Tries interleaved, height-sorted, and seeded random packings; picks the tightest fit.
 *
 * @param {Array<Record<string, unknown>>} products
 * @param {number} columnCount
 */
export function packMasonryColumns(products, columnCount) {
  if (!Array.isArray(products) || products.length === 0) return [];
  if (columnCount <= 1) return [products];

  const candidates = [
    packShortestColumn(interleaveByAspectRatio(products), columnCount),
    packShortestColumn(
      [...products].sort(
        (a, b) => estimatedMasonryHeight(b) - estimatedMasonryHeight(a),
      ),
      columnCount,
    ),
  ];

  const baseSeed = packingSeed(products);
  for (let trial = 0; trial < 16; trial += 1) {
    candidates.push(
      packShortestColumn(
        seededShuffle(products, baseSeed + trial * 9973),
        columnCount,
      ),
    );
  }

  let best = candidates[0];
  let bestSpread = columnHeightSpread(best);
  for (let i = 1; i < candidates.length; i += 1) {
    const spread = columnHeightSpread(candidates[i]);
    if (spread < bestSpread) {
      best = candidates[i];
      bestSpread = spread;
    }
  }

  return best;
}
