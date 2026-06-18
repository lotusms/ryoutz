"use client";

import RyoutzLogo from "@/components/brand/RyoutzLogo";

const WATERMARK_SIZE_CLASS = {
  sm: "h-[min(22%,5.5rem)] w-[min(22%,5.5rem)]",
  md: "h-[min(26%,8rem)] w-[min(26%,8rem)]",
  lg: "h-[min(32%,12rem)] w-[min(32%,12rem)]",
};

/**
 * Wraps gallery artwork with a centered logo watermark and discourages
 * casual save-via-right-click / drag (not a security boundary).
 *
 * @param {{
 *   children: import("react").ReactNode;
 *   className?: string;
 *   watermarkSize?: keyof typeof WATERMARK_SIZE_CLASS;
 * }} props
 */
export default function GalleryImageWell({
  children,
  className = "",
  watermarkSize = "md",
}) {
  const logoSize = WATERMARK_SIZE_CLASS[watermarkSize] ?? WATERMARK_SIZE_CLASS.md;

  return (
    <div
      className={`gallery-image-protected relative select-none ${className}`.trim()}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center"
        aria-hidden
      >
        <RyoutzLogo
          className={`${logoSize} opacity-[0.2] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]`}
          title="RYoutz Asphalt Maintenance"
        />
      </div>
    </div>
  );
}
