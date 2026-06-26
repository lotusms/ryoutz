/**
 * Downloads asphalt-industry photos (Pexels), crops to mixed aspect ratios,
 * and writes manifest metadata for `public/images/gallery/work/`.
 *
 * Images 18–20 (crew with RYoutz-branded shirts) are generated separately and
 * listed in the same manifest — re-run only for 01–17 unless you replace those too.
 *
 * Run: node scripts/build-gallery-work-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const OUT_DIR = path.join(process.cwd(), "public", "images", "gallery", "work");

/** @type {Array<{ file: string; pexelsId: number; w: number; h: number; title: string; medium: string; description: string }>} */
const ASSETS = [
  {
    file: "01-commercial-lot-aerial-16x9.jpg",
    pexelsId: 3952126,
    w: 1920,
    h: 1080,
    title: "Commercial lot — aerial view",
    medium: "Parking lot",
    description: "Fresh sealcoat on a retail parking lot, Central Pennsylvania.",
  },
  {
    file: "02-driveway-sealcoat-portrait-9x16.jpg",
    pexelsId: 3754300,
    w: 1080,
    h: 1920,
    title: "Residential driveway sealcoat",
    medium: "Driveway",
    description: "Even finish on a home driveway after sealcoating.",
  },
  {
    file: "03-fresh-pavement-landscape-16x9.jpg",
    pexelsId: 2219024,
    w: 1920,
    h: 1080,
    title: "Fresh asphalt road surface",
    medium: "Road paving",
    description: "Smooth new pavement on a private access road.",
  },
  {
    file: "04-road-crew-construction-4x3.jpg",
    pexelsId: 1642125,
    w: 1440,
    h: 1080,
    title: "Road repair crew on site",
    medium: "Construction",
    description: "Prep and paving work along a commercial lane.",
  },
  {
    file: "05-lane-striping-close-3x4.jpg",
    pexelsId: 386026,
    w: 1080,
    h: 1440,
    title: "Lane striping detail",
    medium: "Line striping",
    description: "Crisp yellow lines on freshly sealed asphalt.",
  },
  {
    file: "06-urban-street-pavement-16x9.jpg",
    pexelsId: 1271619,
    w: 1920,
    h: 1080,
    title: "Urban street pavement",
    medium: "Street paving",
    description: "Maintained street surface after patch and seal work.",
  },
  {
    file: "07-highway-stretch-landscape-3x2.jpg",
    pexelsId: 1438765,
    w: 1620,
    h: 1080,
    title: "Highway stretch",
    medium: "Highway",
    description: "Long-run seal and stripe on a highway pull-off.",
  },
  {
    file: "08-parking-stalls-square-1x1.jpg",
    pexelsId: 3137063,
    w: 1080,
    h: 1080,
    title: "Parking stall layout",
    medium: "Parking lot",
    description: "Restriped stalls after sealcoating cycle.",
  },
  {
    file: "09-residential-apron-portrait-3x4.jpg",
    pexelsId: 5357342,
    w: 1080,
    h: 1440,
    title: "Garage apron refresh",
    medium: "Driveway",
    description: "Sealcoat on a garage apron and turnaround.",
  },
  {
    file: "10-crack-seal-detail-1x1.jpg",
    pexelsId: 221024,
    w: 1080,
    h: 1080,
    title: "Crack seal detail",
    medium: "Crack repair",
    description: "Hot rubberized crack fill before top coat.",
  },
  {
    file: "11-lot-edge-drainage-4x3.jpg",
    pexelsId: 1077785,
    w: 1440,
    h: 1080,
    title: "Lot edge and drainage",
    medium: "Parking lot",
    description: "Edge work and drainage check after sealing.",
  },
  {
    file: "12-night-site-lighting-9x16.jpg",
    pexelsId: 13834173,
    w: 1080,
    h: 1920,
    title: "Evening sealcoat project",
    medium: "Sealcoating",
    description: "Late-day seal on a church parking area.",
  },
  {
    file: "13-patch-repair-square-1x1.jpg",
    pexelsId: 2425011,
    w: 1080,
    h: 1080,
    title: "Asphalt patch repair",
    medium: "Patching",
    description: "Utility cut patched and blended to surrounding pavement.",
  },
  {
    file: "14-private-road-landscape-16x9.jpg",
    pexelsId: 1591055,
    w: 1920,
    h: 1080,
    title: "Private road maintenance",
    medium: "Private road",
    description: "HOA road seal and crack program.",
  },
  {
    file: "15-handicap-stencil-portrait-9x16.jpg",
    pexelsId: 848573,
    w: 1080,
    h: 1920,
    title: "Handicap symbol restripe",
    medium: "Line striping",
    description: "ADA stencil and blue zone markings.",
  },
  {
    file: "16-curb-line-detail-3x4.jpg",
    pexelsId: 1181467,
    w: 1080,
    h: 1440,
    title: "Curbside edge detail",
    medium: "Sealcoating",
    description: "Hand-cut sealcoat line along curb and gutter.",
  },
  {
    file: "17-loading-dock-lot-3x2.jpg",
    pexelsId: 2449454,
    w: 1620,
    h: 1080,
    title: "Loading dock lot",
    medium: "Commercial",
    description: "Heavy-duty seal on a warehouse apron.",
  },
];

function pexelsUrl(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function cropToSize(file, w, h) {
  execSync(`sips --cropToHeightWidth ${h} ${w} "${file}" --out "${file}"`, {
    stdio: "pipe",
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const order = [];
  const meta = {};

  for (const asset of ASSETS) {
    const dest = path.join(OUT_DIR, asset.file);
    process.stdout.write(`→ ${asset.file}\n`);
    await download(pexelsUrl(asset.pexelsId), dest);
    cropToSize(dest, asset.w, asset.h);
    order.push(asset.file);
    meta[asset.file] = {
      title: asset.title,
      medium: asset.medium,
      description: asset.description,
      imageWidth: asset.w,
      imageHeight: asset.h,
    };
  }

  const manifest = { order, meta };
  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`\nDone — ${order.length} images in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
