import Link from "next/link";

import { orgName } from "@/config";

/**
 * Renders a piece description as alternating paragraphs and bullet lists.
 * Bullets accept `•`, `-`, or `*` as the leading marker.
 *
 * @param {string} text
 */
function renderDescription(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim());
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i += 1;
      continue;
    }

    if (/^(•|-|\*)\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^(•|-|\*)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(•|-|\*)\s+/, "").trim());
        i += 1;
      }
      blocks.push(
        <ul
          key={`list-${blocks.length}`}
          className="ml-1 list-disc space-y-2 pl-5 marker:text-blue-300/60"
        >
          {items.map((item, idx) => (
            <li key={`item-${idx}`}>{item}</li>
          ))}
        </ul>,
      );
      continue;
    }

    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="text-[1.05rem] leading-9 text-amber-200/90 first:text-xl first:leading-9 first:text-amber-100 first:font-light first:tracking-[-0.005em]"
      >
        {line}
      </p>,
    );
    i += 1;
  }

  return blocks;
}

/**
 * Editorial body for a single gallery piece — no specs, no commerce.
 * Falls back to a quiet placeholder when no description is present so
 * the layout doesn't collapse for newly added images.
 */
export default function GalleryPieceStory({ description, title }) {
  const blocks = renderDescription(description);

  if (blocks.length === 0) {
    return (
      <div className="space-y-6">
        <p className="text-[1.05rem] leading-9 text-amber-200/85">
          A quiet frame from {title || "a recent session"}, photographed by{" "}
          {orgName}. The full story behind this image is being written —
          for now, let the picture speak.
        </p>
        <p className="text-sm leading-8 text-amber-400">
          Curious about a similar session?{" "}
          <Link
            href="/contact"
            className="text-blue-200/90 underline-offset-4 transition hover:text-blue-100 hover:underline"
          >
            Reach out
          </Link>
          .
        </p>
      </div>
    );
  }

  return <div className="space-y-6">{blocks}</div>;
}
