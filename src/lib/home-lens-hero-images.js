import fs from "node:fs";
import path from "node:path";
import { homeLensHeroFilenames } from "@/config/config.js";

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

const HOME_LENS_HERO_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "home-lens-hero-images",
);

/**
 * Public URL paths for images in `public/images/home-lens-hero-images`.
 * If `homeLensHeroFilenames` in config is non-empty, only those files are used, in that order.
 * If it is empty, every image in the folder is used (sorted by filename).
 */
export function getHomeLensHeroImagePaths() {
  const dir = HOME_LENS_HERO_DIR;
  if (!fs.existsSync(dir)) return [];

  const names = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()),
    )
    .map((e) => e.name);

  const inDir = new Set(names);

  const allow =
    Array.isArray(homeLensHeroFilenames) && homeLensHeroFilenames.length > 0
      ? homeLensHeroFilenames
      : null;

  const ordered = allow
    ? allow
        .map((n) => String(n ?? "").trim())
        .filter((n) => n && inDir.has(n))
    : [...names].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );

  return ordered.map((name) => `/images/home-lens-hero-images/${name}`);
}
