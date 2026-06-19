"use client";

/**
 * Optional wrapper for gallery images — discourages casual right-click / drag save.
 * (Not a security boundary.)
 */
export default function GalleryImageWell({ children, className = "" }) {
  return (
    <div
      className={`gallery-image-protected relative select-none ${className}`.trim()}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
