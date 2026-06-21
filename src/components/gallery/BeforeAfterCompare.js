"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

function aspectRatioStyle(width, height) {
  if (width > 0 && height > 0) return `${width} / ${height}`;
  return "4 / 5";
}

/**
 * Drag-to-reveal before / after comparison.
 *
 * @param {{
 *   before: string;
 *   after: string;
 *   imageWidth?: number | null;
 *   imageHeight?: number | null;
 *   label?: string;
 *   index?: number;
 * }} props
 */
export default function BeforeAfterCompare({
  before,
  after,
  imageWidth = null,
  imageHeight = null,
  label = "Project",
  index = 1,
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    function onPointerMove(e) {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    }
    function onPointerUp() {
      draggingRef.current = false;
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [updateFromClientX]);

  const ratio = aspectRatioStyle(imageWidth, imageHeight);
  const paddedIndex = String(index).padStart(2, "0");

  return (
    <article className="group relative">
      <div className="pointer-events-none absolute -inset-px rounded-[1.75rem] bg-linear-to-br from-blue-500/20 via-transparent to-amber-500/15 opacity-0 blur-xl transition duration-700 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[1.65rem] border border-amber-500/25 bg-slate-950/80 p-3 shadow-2xl shadow-slate-950/50 ring-1 ring-white/5 sm:p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/35 bg-blue-500/10 font-serif text-sm font-bold text-blue-300">
              {paddedIndex}
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-blue-300/85">
                {label}
              </p>
              <p className="mt-0.5 text-sm text-neutral-200/75">
                Drag the handle to compare
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <span
              className="rounded-full border border-slate-600/60 bg-slate-900/70 px-3 py-1 text-slate-300 transition-opacity duration-300"
              style={{ opacity: position > 35 ? 1 : 0.45 }}
            >
              Before
            </span>
            <span className="text-slate-600" aria-hidden="true">
              /
            </span>
            <span
              className="rounded-full border border-blue-400/35 bg-blue-500/10 px-3 py-1 text-blue-200 transition-opacity duration-300"
              style={{ opacity: position < 65 ? 1 : 0.45 }}
            >
              After
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative touch-none select-none overflow-hidden rounded-xl ring-[3px] ring-amber-500/30"
          style={{ aspectRatio: ratio }}
          onPointerDown={(e) => {
            draggingRef.current = true;
            containerRef.current?.setPointerCapture(e.pointerId);
            updateFromClientX(e.clientX);
          }}
          role="slider"
          aria-label={`${label} before and after comparison`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setPosition((p) => Math.max(0, p - 4));
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setPosition((p) => Math.min(100, p + 4));
            }
          }}
        >
          <Image
            src={after}
            alt={`${label} after`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
            quality={88}
            className="object-cover object-center"
            draggable={false}
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src={before}
              alt={`${label} before`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
              quality={88}
              className="object-cover object-center"
              draggable={false}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.55)]"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          />

          <div
            className="pointer-events-none absolute top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-slate-950/85 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:h-14 sm:w-14"
            style={{ left: `${position}%` }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-slate-950/70 to-transparent" />
        </div>
      </div>
    </article>
  );
}
