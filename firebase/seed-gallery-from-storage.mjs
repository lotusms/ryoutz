/**
 * Seed the Firestore `gallery` collection from Firebase Storage `gallery/*`.
 *
 * For every object under the `gallery/` prefix in the configured bucket,
 * upserts a `gallery/{slug}` document containing a public download URL,
 * derived title, intrinsic image dimensions (when readable), and basic
 * file metadata. Public Storage rules + public Firestore read rules let
 * the storefront render images without auth.
 *
 * Run:
 *   pnpm firebase:seed:gallery                 # upsert all (new + merge computed fields on existing)
 *   pnpm firebase:seed:gallery -- --new-only   # create docs only for Storage files with no gallery doc yet
 *   pnpm firebase:seed:gallery -- --prune      # also delete docs whose Storage object is gone
 *   pnpm firebase:seed:gallery -- --dry-run    # log changes without writing
 */
import fs from "node:fs";
import path from "node:path";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const DB =
  process.env.FIRESTORE_DATABASE_ID?.trim() ||
  process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID?.trim() ||
  "main";

const STORAGE_PREFIX = "gallery/";
const FIRESTORE_COLLECTION = "gallery";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// ─── arg parsing ─────────────────────────────────────────────────────────────

function parseArgs() {
  const flags = new Set(process.argv.slice(2));
  return {
    prune: flags.has("--prune"),
    dryRun: flags.has("--dry-run") || flags.has("--dryrun"),
    newOnly: flags.has("--new-only") || flags.has("--newonly"),
  };
}

// ─── credentials (mirror `src/lib/firebase-admin-server.js`) ─────────────────

function stripQuotes(v) {
  const s = String(v ?? "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).trim();
  }
  return s;
}

function resolveCredPath(raw) {
  const p = stripQuotes(raw);
  if (!p) return null;
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p.replace(/^\.\//, ""));
}

function initAdmin() {
  if (getApps().length) return;

  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    initializeApp({ credential: cert(JSON.parse(inline)) });
    return;
  }

  const pathFromEnv =
    stripQuotes(process.env.FIREBASE_SERVICE_ACCOUNT_PATH) ||
    stripQuotes(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (pathFromEnv) {
    const resolved = resolveCredPath(pathFromEnv);
    if (!resolved || !fs.existsSync(resolved)) {
      let hint = "";
      try {
        const matches = fs
          .readdirSync(process.cwd())
          .filter((n) => /firebase-adminsdk.*\.json$/i.test(n));
        if (matches.length) {
          hint = ` Files in this folder that look like keys: ${matches.join(", ")}. Set FIREBASE_SERVICE_ACCOUNT_PATH to match (often includes your project id, e.g. *-bd591-*).`;
        }
      } catch {
        /* ignore */
      }
      throw new Error(`Service account file not found: ${resolved ?? "(empty path)"}.${hint}`);
    }
    initializeApp({ credential: cert(JSON.parse(fs.readFileSync(resolved, "utf8"))) });
    return;
  }

  throw new Error(
    "Set FIREBASE_SERVICE_ACCOUNT_JSON / FIREBASE_SERVICE_ACCOUNT_PATH / GOOGLE_APPLICATION_CREDENTIALS in .env.local.",
  );
}

function bucketName() {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()}.firebasestorage.app`
  );
}

// ─── filename → slug / title ────────────────────────────────────────────────

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseWords(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Mirrors `displayTitleFromImageFilename` — `elvis-clarissa_bekmanis.jpg` → `Elvis & Clarissa Bekmanis`. */
function displayTitleFromFilename(name) {
  const base = String(name || "").replace(/\.[^.]+$/, "");
  const parts = base.split("-").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return base.trim();
  return parts.map((seg) => titleCaseWords(seg.replace(/_/g, " "))).join(" & ");
}

// ─── pure-JS image dimensions (JPEG / PNG / WebP) ───────────────────────────

function readDimensionsJpeg(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 8) {
    if (buf[i] !== 0xff) return null;
    let marker = buf[i + 1];
    i += 2;
    while (marker === 0xff && i < buf.length) {
      marker = buf[i];
      i += 1;
    }
    // SOF markers carry width/height (skip DHT/DAC/RST*)
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof) {
      if (i + 7 > buf.length) return null;
      return {
        height: buf.readUInt16BE(i + 3),
        width: buf.readUInt16BE(i + 5),
      };
    }
    if (marker === 0xd9 || marker === 0xda) return null;
    if (i + 2 > buf.length) return null;
    const segLen = buf.readUInt16BE(i);
    i += segLen;
  }
  return null;
}

function readDimensionsPng(buf) {
  if (buf.length < 24) return null;
  // 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] !== 0x89 ||
    buf[1] !== 0x50 ||
    buf[2] !== 0x4e ||
    buf[3] !== 0x47
  ) {
    return null;
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function readDimensionsWebp(buf) {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const b0 = buf[21];
    const b1 = buf[22];
    const b2 = buf[23];
    const b3 = buf[24];
    return {
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
    };
  }
  if (chunk === "VP8X") {
    return {
      width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
      height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
    };
  }
  return null;
}

function readDimensions(buf, contentType, filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || contentType === "image/jpeg") {
    return readDimensionsJpeg(buf);
  }
  if (ext === ".png" || contentType === "image/png") return readDimensionsPng(buf);
  if (ext === ".webp" || contentType === "image/webp") return readDimensionsWebp(buf);
  return null;
}

// ─── download the first N bytes of a Storage object ─────────────────────────

async function readHeaderBytes(file, byteCount = 128 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    const stream = file.createReadStream({ start: 0, end: byteCount - 1 });
    stream.on("data", (chunk) => {
      chunks.push(chunk);
      total += chunk.length;
      if (total >= byteCount) stream.destroy();
    });
    stream.on("error", reject);
    stream.on("close", () => resolve(Buffer.concat(chunks)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

// ─── public Firebase download URL (alt=media, no token; relies on public read rules) ───

function publicDownloadUrl(bucket, objectPath) {
  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encoded}?alt=media`;
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  const { prune, dryRun, newOnly } = parseArgs();
  initAdmin();

  const app = getApp();
  const bucket = getStorage(app).bucket(bucketName());
  const db = getFirestore(app, DB);

  console.log(`Firestore database: ${DB}`);
  console.log(`Storage bucket:     ${bucket.name}`);
  console.log(`Prefix:             ${STORAGE_PREFIX}`);
  console.log(
    `Mode:               ${dryRun ? "DRY RUN (no writes)" : "WRITE"}${prune ? " · prune" : ""}${newOnly ? " · new-only" : ""}\n`,
  );

  let nextSortIndex = null;
  if (newOnly) {
    const gallerySnap = await db.collection(FIRESTORE_COLLECTION).get();
    let maxSort = -1;
    for (const d of gallerySnap.docs) {
      const si = Number(d.data()?.sortIndex);
      if (Number.isFinite(si) && si > maxSort) maxSort = si;
    }
    nextSortIndex = maxSort + 1;
    console.log(`New-only: next sortIndex starts at ${nextSortIndex}\n`);
  }

  const [files] = await bucket.getFiles({ prefix: STORAGE_PREFIX });
  const imageFiles = files.filter((f) => {
    if (!f.name || f.name.endsWith("/")) return false;
    const ext = path.extname(f.name).toLowerCase();
    return IMAGE_EXT.has(ext);
  });

  if (imageFiles.length === 0) {
    console.warn(`No images found under ${STORAGE_PREFIX}. Upload some and rerun.`);
  }

  const seenSlugs = new Set();
  let upserts = 0;
  let unchanged = 0;
  let skippedExisting = 0;
  let dimsOk = 0;
  let dimsMissing = 0;

  for (const [index, file] of imageFiles.entries()) {
    const filename = path.basename(file.name);
    const stem = filename.replace(/\.[^.]+$/, "");
    let slug = slugify(stem) || slugify(filename);

    // Disambiguate slug collisions deterministically (`foo`, `foo-2`, `foo-3` …).
    let unique = slug;
    let n = 2;
    while (seenSlugs.has(unique)) {
      unique = `${slug}-${n}`;
      n += 1;
    }
    slug = unique;
    seenSlugs.add(slug);

    const docRef = db.collection(FIRESTORE_COLLECTION).doc(slug);
    const existing = await docRef.get();

    if (newOnly && existing.exists) {
      skippedExisting += 1;
      continue;
    }

    const [meta] = await file.getMetadata();
    const contentType = String(meta.contentType || "").toLowerCase() || null;
    const sizeBytes = Number(meta.size) || 0;
    const updatedSrc = meta.updated ? new Date(meta.updated) : null;

    let dimensions = null;
    try {
      const header = await readHeaderBytes(file);
      dimensions = readDimensions(header, contentType, filename);
    } catch (e) {
      console.warn(`  ! header read failed for ${file.name}: ${e.message || e}`);
    }
    if (dimensions) dimsOk += 1;
    else dimsMissing += 1;

    const sortIndex = newOnly ? nextSortIndex++ : index;

    const base = {
      slug,
      title: displayTitleFromFilename(filename),
      description: "",
      medium: "Photography",
      dimensions: "",
      image: publicDownloadUrl(bucket.name, file.name),
      storagePath: file.name,
      storageBucket: bucket.name,
      contentType,
      sizeBytes,
      imageWidth: dimensions?.width ?? null,
      imageHeight: dimensions?.height ?? null,
      sortIndex,
      available: true,
      featured: false,
      onHomeSlider: false,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (!existing.exists) {
      const fresh = {
        ...base,
        createdAt: updatedSrc
          ? FieldValue.serverTimestamp()
          : FieldValue.serverTimestamp(),
      };
      console.log(`+ ${slug}  (new)  ${dimensions ? `${dimensions.width}×${dimensions.height}` : "no dims"}`);
      if (!dryRun) await docRef.set(fresh);
      upserts += 1;
      continue;
    }

    // Merge so admin-edited fields (title, description, medium, featured…) survive.
    // We only force-overwrite computed / derived fields tied to the Storage object.
    const computedOnly = {
      slug,
      image: base.image,
      storagePath: base.storagePath,
      storageBucket: base.storageBucket,
      contentType: base.contentType,
      sizeBytes: base.sizeBytes,
      imageWidth: base.imageWidth,
      imageHeight: base.imageHeight,
      updatedAt: base.updatedAt,
    };

    const prev = existing.data() || {};
    const changedKeys = Object.entries(computedOnly).filter(
      ([k, v]) =>
        k !== "updatedAt" &&
        JSON.stringify(prev[k] ?? null) !== JSON.stringify(v ?? null),
    );

    if (changedKeys.length === 0) {
      unchanged += 1;
      continue;
    }

    console.log(
      `~ ${slug}  (updated: ${changedKeys.map(([k]) => k).join(", ")})`,
    );
    if (!dryRun) await docRef.set(computedOnly, { merge: true });
    upserts += 1;
  }

  let pruned = 0;
  if (prune) {
    const snap = await db.collection(FIRESTORE_COLLECTION).get();
    for (const doc of snap.docs) {
      if (!seenSlugs.has(doc.id)) {
        console.log(`- ${doc.id}  (orphaned, deleting)`);
        if (!dryRun) await doc.ref.delete();
        pruned += 1;
      }
    }
  }

  console.log(
    `\nDone — upserted ${upserts}, unchanged ${unchanged}${
      newOnly ? `, skipped (already in Firestore) ${skippedExisting}` : ""
    }, dims ok ${dimsOk}, dims missing ${dimsMissing}${prune ? `, pruned ${pruned}` : ""}.${
      dryRun ? " (dry run, nothing written)" : ""
    }`,
  );
}

main().catch((e) => {
  console.error(e?.stack || e?.message || e);
  process.exit(1);
});
