import fs from "node:fs";
import path from "node:path";

const BEFORE_AFTER_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "before-after",
);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

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

function readJpegDimensionsSync(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      i += 2;
      if (marker === 0xc0 || marker === 0xc2) {
        const height = buf.readUInt16BE(i + 3);
        const width = buf.readUInt16BE(i + 5);
        if (width > 0 && height > 0) return { width, height };
        return null;
      }
      const len = buf.readUInt16BE(i);
      if (len < 2) return null;
      i += len;
    }
  } catch {
    return null;
  }
  return null;
}

function readImageDimensionsSync(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return readPngDimensionsSync(filePath);
  if (ext === ".jpg" || ext === ".jpeg") return readJpegDimensionsSync(filePath);
  return null;
}

/**
 * @returns {Array<{
 *   id: number;
 *   before: string;
 *   after: string;
 *   imageWidth: number | null;
 *   imageHeight: number | null;
 * }>}
 */
export function getBeforeAfterPairsSync() {
  if (!fs.existsSync(BEFORE_AFTER_DIR)) return [];

  const beforeById = new Map();
  const afterById = new Map();

  for (const file of fs.readdirSync(BEFORE_AFTER_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const match = /^before(\d+)$/i.exec(path.basename(file, ext));
    if (match) {
      beforeById.set(Number(match[1]), file);
      continue;
    }
    const afterMatch = /^after(\d+)$/i.exec(path.basename(file, ext));
    if (afterMatch) afterById.set(Number(afterMatch[1]), file);
  }

  return [...beforeById.keys()]
    .filter((id) => afterById.has(id))
    .sort((a, b) => a - b)
    .map((id) => {
      const beforeFile = beforeById.get(id);
      const afterFile = afterById.get(id);
      const dims =
        readImageDimensionsSync(path.join(BEFORE_AFTER_DIR, beforeFile)) ??
        readImageDimensionsSync(path.join(BEFORE_AFTER_DIR, afterFile));

      return {
        id,
        before: `/images/before-after/${beforeFile}`,
        after: `/images/before-after/${afterFile}`,
        imageWidth: dims?.width ?? null,
        imageHeight: dims?.height ?? null,
      };
    });
}
