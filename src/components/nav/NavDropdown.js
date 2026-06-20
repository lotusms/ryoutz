"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function isActivePath(pathname, href, prefix) {
  if (prefix) return pathname === href || pathname.startsWith(`${href}/`);
  if (href === "/") return pathname === "/";
  return pathname === href;
}

function isNavItemActive(pathname, item) {
  if (Array.isArray(item.children) && item.children.length > 0) {
    if (item.pathPrefix && pathname.startsWith(`${item.pathPrefix}/`)) return true;
    return item.children.some(
      (child) =>
        pathname === child.href || pathname.startsWith(`${child.href}/`),
    );
  }
  return isActivePath(pathname, item.href, item.prefix);
}

/**
 * Desktop flyout for a `mainNav` group (`label` + `children`, no `href`).
 *
 * @param {{ item: { label: string; pathPrefix?: string; children: Array<{ href: string; label: string; description?: string }> } }} props
 */
export default function NavDropdown({ item }) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const closeTimerRef = useRef(null);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }
  function openNow() {
    cancelClose();
    setOpen(true);
  }
  function scheduleClose() {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), 160);
  }

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`group inline-flex items-center gap-1.5 py-1 text-[0.7rem] font-serif font-bold uppercase tracking-[0.35em] transition-colors ${
          active || open ? "text-neutral-200/90" : "text-neutral-200/90 hover:text-white"
        }`}
      >
        <span className="relative">
          {item.label}
          <span
            className={`absolute -bottom-1.5 left-0 h-px bg-linear-to-r from-blue-400/80 to-blue-200/40 transition-all duration-300 ${
              active || open
                ? "w-full opacity-100"
                : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
            }`}
            aria-hidden
          />
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        role="menu"
        aria-label={item.label}
        aria-hidden={!open}
        className={`absolute left-1/2 top-full z-50 mt-5 w-80 -translate-x-1/2 transition-all duration-200 ease-out ${
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="absolute -top-5 left-0 right-0 h-5" aria-hidden />
        <div className="rounded-2xl border border-white/15 bg-slate-900/98 p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/8 backdrop-blur-xl">
          {item.children.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`group/item flex flex-col gap-1 rounded-xl px-4 py-3 transition-colors ${
                  childActive
                    ? "bg-blue-400/10 text-blue-50"
                    : "hover:bg-white/5"
                }`}
              >
                <span
                  className={`font-serif text-base font-medium tracking-[-0.01em] transition-colors ${
                    childActive
                      ? "text-white"
                      : "text-neutral-200/90 group-hover/item:text-white"
                  }`}
                >
                  {child.label}
                </span>
                {child.description ? (
                  <span className="text-xs leading-relaxed text-neutral-200/90">
                    {child.description}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
