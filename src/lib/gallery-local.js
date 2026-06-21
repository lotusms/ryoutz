import fs from "node:fs";
import path from "node:path";
import {
  applyCatalogMerchandising,
  loadCatalogMerchandisingState,
} from "@/lib/catalog-merchandising";
import { shuffleCatalogDisplayOrder } from "@/lib/catalogSort";
import { displayTitleFromImageFilename } from "@/lib/image-filename-display-title";
import { slugify } from "@/lib/slug";

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const STOCK_GALLERY_DIR = path.join(GALLERY_DIR, "stock");
const WORK_GALLERY_DIR = path.join(GALLERY_DIR, "work");

function readPngDimensionsSync(filePath) {
  try {
    const fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    if (buf.readUInt32BE(0) !== 0x89504e47) return null;
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    if (!(width > 0 && height > 0)) return null;
    return { width, height };
  } catch {
    return null;
  }
}

function readGalleryDirectory(dir) {
  if (!fs.existsSync(dir)) return [];

  const publicRoot = path.join(process.cwd(), "public");
  const urlBase =
    "/" + path.relative(publicRoot, dir).split(path.sep).join("/");

  let manifest = {};
  const manifestPath = path.join(dir, "manifest.json");
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch {
      manifest = {};
    }
  }

  const meta =
    manifest.meta && typeof manifest.meta === "object" ? manifest.meta : {};
  const order = Array.isArray(manifest.order) ? manifest.order : null;

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isFile() &&
        IMAGE_EXT.has(path.extname(e.name).toLowerCase()) &&
        e.name !== "manifest.json",
    )
    .map((e) => e.name);

  const ordered = order
    ? [
        ...order.filter((n) => entries.includes(n)),
        ...entries
          .filter((n) => !order.includes(n))
          .sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" }),
          ),
      ]
    : [...entries].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );

  const usedSlugs = new Set();
  const pieces = [];

  for (const filename of ordered) {
    const full = path.join(dir, filename);
    const stat = fs.statSync(full);
    const stem = path.basename(filename, path.extname(filename));
    const fileMeta = meta[filename] || meta[stem] || {};

    let slug = slugify(
      typeof fileMeta.slug === "string" && fileMeta.slug.trim()
        ? fileMeta.slug.trim()
        : stem,
    );
    if (!slug) slug = slugify(filename);
    let uniqueSlug = slug;
    let n = 2;
    while (usedSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${n}`;
      n += 1;
    }
    usedSlugs.add(uniqueSlug);

    const title =
      String(
        fileMeta.title || displayTitleFromImageFilename(filename),
      ).trim() || uniqueSlug;
    const description = String(fileMeta.description || "").trim();
    const medium = String(fileMeta.medium || "Asphalt project").trim();
    const dimensions = String(fileMeta.dimensions || "").trim();

    let iw = Number(fileMeta.imageWidth);
    let ih = Number(fileMeta.imageHeight);
    if (!(Number.isFinite(iw) && iw > 0 && Number.isFinite(ih) && ih > 0)) {
      if (path.extname(filename).toLowerCase() === ".png") {
        const dims = readPngDimensionsSync(full);
        if (dims) {
          iw = dims.width;
          ih = dims.height;
        }
      }
    }

    pieces.push({
      id: uniqueSlug,
      slug: uniqueSlug,
      title,
      description,
      image: `${urlBase}/${filename}`,
      imageWidth: Number.isFinite(iw) && iw > 0 ? iw : null,
      imageHeight: Number.isFinite(ih) && ih > 0 ? ih : null,
      medium,
      dimensions,
      variants: [],
      printfulProductId: null,
      catalogUpdatedAt: Math.floor(stat.mtimeMs),
    });
  }

  return pieces;
}

/** Your own project photos in `public/images/gallery` (top-level files only). */
export function getRawGalleryPiecesSync() {
  return [
    ...readGalleryDirectory(GALLERY_DIR),
    ...readGalleryDirectory(WORK_GALLERY_DIR),
  ];
}

/** Bundled placeholder photos in `public/images/gallery/stock` (always shipped with the site). */
export function getRawBundledStockPiecesSync() {
  return readGalleryDirectory(STOCK_GALLERY_DIR);
}

/** Project photos in `public/images/gallery/work` (mixed aspect ratios). */
export function getRawWorkGalleryPiecesSync() {
  return readGalleryDirectory(WORK_GALLERY_DIR);
}

/** Work gallery list + Firestore merchandising flags. */
export async function getWorkGalleryProducts() {
  const raw = getRawWorkGalleryPiecesSync();
  const state = await loadCatalogMerchandisingState();
  return shuffleCatalogDisplayOrder(applyCatalogMerchandising(raw, state));
}

/** Gallery list + detail: merges Firestore merchandising (visibility, featured, categories). */
export async function getLocalGalleryProducts() {
  const raw = getRawGalleryPiecesSync();
  const state = await loadCatalogMerchandisingState();
  return applyCatalogMerchandising(raw, state);
}

export async function getLocalGalleryProductBySlug(slug) {
  const products = await getLocalGalleryProducts();
  const wanted = String(slug || "").trim();
  return products.find((p) => p.slug === wanted) ?? null;
}
