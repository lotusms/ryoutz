"use client";

import { useId } from "react";

const ROAD_LINE = {
  white: "#FFFFFF",
  yellowA: "#FFD316",
  yellowB: "#F0B90B",
};

const CORNER_SIZE = 480;

const YELLOW_INNER = 388;
const YELLOW_OUTER = 404;
const WHITE_GAP = 68;

/** Parallel stripes: white dash — double yellow — white dash (symmetric spacing). */
const CORNER_STRIPES = [
  { offset: YELLOW_INNER - WHITE_GAP, dashed: true },
  { offset: YELLOW_INNER, color: ROAD_LINE.yellowA },
  { offset: YELLOW_OUTER, color: ROAD_LINE.yellowB },
  { offset: YELLOW_OUTER + WHITE_GAP, dashed: true },
];

function buildStripePath(x1, y1, x2, y2) {
  return `M ${x1},${y1} L ${x2},${y2}`;
}

/** Precomputed so SSR and client markup always match (avoids hydration mismatch). */
const PAINTED_STRIPE_PATHS = {
  "top-left": CORNER_STRIPES.map((stripe) =>
    buildStripePath(0, stripe.offset, stripe.offset, 0),
  ),
  "bottom-right": CORNER_STRIPES.map((stripe) => {
    const k = stripe.offset;
    return buildStripePath(
      CORNER_SIZE - k,
      CORNER_SIZE,
      CORNER_SIZE,
      CORNER_SIZE - k,
    );
  }),
};

function WeatheredPaintFilter({ id }) {
  return (
    <filter
      id={id}
      filterUnits="objectBoundingBox"
      x="-0.35"
      y="-0.35"
      width="1.7"
      height="1.7"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.62 0.11"
        numOctaves="3"
        seed="8"
        result="edgeNoise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="edgeNoise"
        scale="1.15"
        xChannelSelector="R"
        yChannelSelector="G"
        result="paint"
      />

      <feTurbulence
        type="fractalNoise"
        baseFrequency="1.35 0.42"
        numOctaves="4"
        seed="21"
        result="chipNoise"
      />
      <feComponentTransfer in="chipNoise" result="chipMask">
        <feFuncR type="linear" slope="0" intercept="0" />
        <feFuncG type="linear" slope="0" intercept="0" />
        <feFuncB type="linear" slope="0" intercept="0" />
        <feFuncA
          type="table"
          tableValues="0.08 0.48 0.14 0.55 0.1 0.42 0.12 0.5"
        />
      </feComponentTransfer>
      <feComposite
        in="chipMask"
        in2="SourceGraphic"
        operator="in"
        result="chipOnStroke"
      />
      <feComposite in="paint" in2="chipOnStroke" operator="out" result="chipped" />

      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.22 0.08"
        numOctaves="3"
        seed="14"
        result="fadeNoise"
      />
      <feComponentTransfer in="fadeNoise" result="fadeMask">
        <feFuncR type="linear" slope="0" intercept="0" />
        <feFuncG type="linear" slope="0" intercept="0" />
        <feFuncB type="linear" slope="0" intercept="0" />
        <feFuncA
          type="table"
          tableValues="0.55 0.95 0.62 0.88 0.5 0.92 0.58 0.85"
        />
      </feComponentTransfer>
      <feComposite
        in="fadeMask"
        in2="SourceGraphic"
        operator="in"
        result="fadeOnStroke"
      />
      <feBlend in="chipped" in2="fadeOnStroke" mode="screen" result="faded" />

      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.09 0.28"
        numOctaves="2"
        seed="33"
        result="crackNoise"
      />
      <feColorMatrix
        in="crackNoise"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 7 -2.4"
        result="crackMask"
      />
      <feComposite
        in="crackMask"
        in2="SourceGraphic"
        operator="in"
        result="cracksOnStroke"
      />
      <feFlood floodColor="#141414" floodOpacity="0.28" result="crackColor" />
      <feComposite in="crackColor" in2="cracksOnStroke" operator="in" result="cracks" />
      <feComposite in="faded" in2="cracks" operator="over" result="weathered" />
      <feColorMatrix
        in="weathered"
        type="matrix"
        values="1.12 0 0 0 0.04
                0 1.1 0 0 0.03
                0 0 0.98 0 0.01
                0 0 0 1.12 0"
        result="boosted"
      />
      <feComposite in="boosted" in2="SourceGraphic" operator="in" />
    </filter>
  );
}

/**
 * Single corner — weathered diagonal road stripes (SVG).
 *
 * @param {{
 *   filterId: string;
 *   corner?: "top-left" | "bottom-right";
 *   opacity?: number;
 *   className?: string;
 * }} props
 */
export function RoadLineCorner({
  filterId,
  corner = "top-left",
  opacity = 0.2,
  className = "",
}) {
  const isTopLeft = corner === "top-left";
  const size = CORNER_SIZE;

  const positionClass = isTopLeft ? "left-0 top-0" : "right-0 bottom-0";

  const dimensionClass =
    "h-[min(66vw,32rem)] w-[min(66vw,32rem)] sm:h-[min(60vw,36rem)] sm:w-[min(60vw,36rem)]";

  return (
    <svg
      className={`absolute ${positionClass} ${dimensionClass} isolate ${className}`.trim()}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <WeatheredPaintFilter id={filterId} />
      </defs>
      <g opacity={opacity}>
        {CORNER_STRIPES.map((stripe, idx) => (
          <path
            key={`${corner}-${idx}`}
            d={PAINTED_STRIPE_PATHS[corner][idx]}
            filter={`url(#${filterId})`}
            stroke={stripe.dashed ? ROAD_LINE.white : stripe.color}
            strokeWidth="6"
            strokeDasharray={stripe.dashed ? "92 44" : undefined}
            strokeLinecap="butt"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Diagonal road-line overlays in the top-left and bottom-right corners.
 * Import where needed, or omit entirely.
 *
 * @param {{
 *   opacity?: number;
 *   className?: string;
 *   showTopLeft?: boolean;
 *   showBottomRight?: boolean;
 * }} props
 */
export default function HeroRoadLineOverlay({
  opacity = 0.2,
  className = "",
  showTopLeft = true,
  showBottomRight = true,
}) {
  const uid = useId().replace(/:/g, "");

  if (!showTopLeft && !showBottomRight) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-2 isolate overflow-hidden ${className}`.trim()}
      aria-hidden
    >
      {showTopLeft ? (
        <RoadLineCorner filterId={`${uid}-tl`} corner="top-left" opacity={opacity} />
      ) : null}
      {showBottomRight ? (
        <RoadLineCorner filterId={`${uid}-br`} corner="bottom-right" opacity={opacity} />
      ) : null}
    </div>
  );
}
