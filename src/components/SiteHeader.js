"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import RyoutzLogo from "@/components/brand/RyoutzLogo";
import NavDropdown from "@/components/nav/NavDropdown";
import { mainNav, orgName, orgPhoneLabel, orgPhoneTel } from "@/config";

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function isActivePath(pathname, href, prefix) {
  if (prefix) return pathname === href || pathname.startsWith(`${href}/`);
  if (href === "/") return pathname === "/";
  return pathname === href;
}

/** Stable key for any mainNav entry — groups have no href, links do. */
function navItemKey(item) {
  return item.href ?? `group:${item.label}`;
}

/**
 * True when the user is on this nav item — or, for a group, on any of its
 * children. `pathPrefix` is treated as a styling-only marker and never
 * implies a navigable page.
 */
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

/** Nav group key to auto-expand in the mobile menu for the current route. */
function activeParentNavKey(pathname) {
  const parent = mainNav.find(
    (item) =>
      Array.isArray(item.children) &&
      item.children.length > 0 &&
      isNavItemActive(pathname, item),
  );
  return parent ? navItemKey(parent) : null;
}

function NavLink({ href, label, prefix, onNavigate, className = "" }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href, prefix);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group relative py-1 text-[0.7rem] font-serif font-bold uppercase tracking-[0.35em] transition-colors ${className} ${
        active ? "text-neutral-200/90 " : "text-neutral-200/90 hover:text-white"
      }`}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={`absolute -bottom-0.5 left-0 h-px bg-blue-400 transition-all duration-300 ${
          active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
        }`}
        aria-hidden
      />
    </Link>
  );
}

/** Scroll distance before the header picks up the solid bar (transparent → scrim). */
const SCROLL_ELEVATE_PX = 168;

function subscribeWindowScroll(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function scrollElevatedSnapshot() {
  return window.scrollY > SCROLL_ELEVATE_PX;
}

function scrollElevatedServerSnapshot() {
  return false;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(() =>
    activeParentNavKey(pathname),
  );
  const [lastPathname, setLastPathname] = useState(pathname);
  const panelId = useId();

  // Reset mobile accordion when the route changes (React “adjust state when props change”).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileExpanded(activeParentNavKey(pathname));
  }

  const scrollElevated = useSyncExternalStore(
    subscribeWindowScroll,
    scrollElevatedSnapshot,
    scrollElevatedServerSnapshot,
  );

  const showSolidBar = scrollElevated || open;

  function setScrollLocked(locked) {
    document.body.style.overflow = locked ? "hidden" : "";
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }

  useEffect(() => {
    setScrollLocked(open);

    return () => {
      setScrollLocked(false);
    };
  }, [open]);

  useEffect(() => {
    setScrollLocked(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  const phoneHref = orgPhoneTel?.trim()
    ? `tel:${orgPhoneTel.replace(/\s/g, "")}`
    : null;

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-105 h-44 bg-linear-to-b from-black/80 via-black/45 to-transparent transition-opacity duration-300 ease-out sm:h-52 lg:h-56 ${
          showSolidBar ? "opacity-0" : "opacity-100"
        }`}
      />
      <header
        className={`fixed inset-x-0 top-0 z-110 transition-[border-color,background-color,box-shadow,backdrop-filter] duration-300 ease-out py-2 ${
          showSolidBar
            ? "border-b border-white/6 bg-slate-950/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150 supports-backdrop-filter:bg-slate-950/70"
            : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none supports-backdrop-filter:bg-transparent"
        }`}
      >
        <div className="relative z-120 mx-auto flex h-18 max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="group relative z-10 flex shrink-0 items-center rounded-sm text-slate-100 transition-colors duration-300 hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/60"
            onClick={close}
            aria-label={`${orgName} — home`}
          >
            <RyoutzLogo
              className="h-11 w-39 shrink-0 sm:h-16 sm:w-46 lg:h-19 lg:w-54"
              title={orgName}
              neutralColor="#FFFFFF"
            />
          </Link>

          {/* Main Navigation */}
          <nav
            aria-label="Main"
            className="absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-9 min-[992px]:flex">
            {mainNav.map((item) => {
              const hasChildren =
                Array.isArray(item.children) && item.children.length > 0;
              if (hasChildren) {
                return <NavDropdown key={navItemKey(item)} item={item} />;
              }
              return (
                <NavLink
                  key={navItemKey(item)}
                  href={item.href}
                  label={item.label}
                  prefix={item.prefix}
                />
              );
            })}
          </nav>

          {/* Phone Number */}
          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {phoneHref ? (
              <a
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-2.5 py-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-neutral-200 transition hover:border-blue-400/35 hover:bg-white/7 hover:text-neutral-50 min-[420px]:px-3 sm:px-4 sm:tracking-[0.28em]"
                href={phoneHref}
                aria-label={`Call ${orgPhoneLabel}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4 shrink-0 text-blue-300/90"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <span className="hidden whitespace-nowrap text-xs font-semibold tabular-nums tracking-normal text-neutral-200/90 min-[420px]:inline sm:text-sm">
                  {orgPhoneLabel}
                </span>
              </a>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/6 text-neutral-200/90 transition hover:border-blue-400/35 hover:bg-white/1 min-[992px]:hidden"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-current transition-transform duration-300 ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: `backdrop-filter` on header traps `position:fixed` descendants — full-screen menu would only paint under the bar on mobile. */}
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        className={`mobile-nav-panel fixed inset-0 z-100 flex h-full min-h-dvh flex-col min-[992px]:hidden ${open ? "mobile-nav-panel--open" : ""} transition-[visibility,opacity] duration-300 ease-out ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-slate-950" aria-hidden/>

        {/* Mobile Menu Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-[20%] -top-[10%] h-[min(90vw,28rem)] w-[min(90vw,28rem)] rounded-full bg-blue-600/22 blur-[90px]" />
          <div className="absolute -right-[15%] bottom-[-20%] h-[min(110vw,32rem)] w-[min(110vw,32rem)] rounded-full bg-blue-400/18 blur-[100px]" />
          <div className="absolute left-[40%] top-[35%] h-48 w-48 rounded-full bg-sky-400/12 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-400/35 to-transparent" />
        </div>

        {/* Mobile Menu Grain Background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: GRAIN_BG }}/>

        {/* Mobile Menu Content */} 
        <div className="relative z-10 flex h-full min-h-dvh flex-1 flex-col pt-[max(5.5rem,env(safe-area-inset-top))]">
          {/* Mobile Menu Navigation */}
          <nav
            aria-label="Mobile main"
            className="flex flex-1 flex-col justify-start gap-0 overflow-y-auto px-2 sm:px-6">
            {mainNav.map((item, i) => {
              const active = isNavItemActive(pathname, item);
              const animationDelay = open ? `${70 + i * 55}ms` : "0ms";
              const indexLabel = String(i + 1).padStart(2, "0");
              const hasChildren =
                Array.isArray(item.children) && item.children.length > 0;
              const itemKey = navItemKey(item);

              if (hasChildren) {
                const expanded = mobileExpanded === itemKey;
                return (
                  <div
                    key={itemKey}
                    className="border-b border-white/[0.07]"
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setMobileExpanded((prev) =>
                          prev === itemKey ? null : itemKey,
                        )
                      }
                      style={{ animationDelay }}
                      className={`mobile-nav-item group relative flex w-full items-center gap-5 py-5 pl-4 pr-2 text-left transition-colors sm:gap-8 sm:py-6 ${
                        active
                          ? "bg-white/4 text-blue-50"
                          : "text-neutral-200/90 hover:bg-white/3 hover:text-white"
                      }`}
                    >
                      <span
                        className={`w-8 shrink-0 font-mono text-[0.7rem] tabular-nums tracking-widest sm:w-10 sm:text-xs ${
                          active ? "text-blue-400/90" : "text-slate-500"
                        }`}
                      >
                        {indexLabel}
                      </span>
                      <span className="min-w-0 font-serif text-[clamp(1.75rem,6vw,2.75rem)] font-medium leading-none tracking-[-0.03em]">
                        {item.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-auto h-5 w-5 shrink-0 text-blue-400/60 transition-transform duration-300 ${
                          expanded ? "rotate-180 text-blue-300/90" : ""
                        }`}
                        aria-hidden
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      {active ? (
                        <span
                          className="absolute bottom-5 left-0 top-5 w-0.5 rounded-full bg-linear-to-b from-blue-400 to-blue-600/50 sm:bottom-6 sm:top-6"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        expanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                      aria-hidden={!expanded}
                    >
                      <div className="min-h-0">
                        <ul className="space-y-1 px-12 pb-5 pt-1 sm:px-16">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={close}
                                  className={`block rounded-lg px-4 py-3 transition-colors ${
                                    childActive
                                      ? "bg-blue-400/10 text-blue-50"
                                      : "text-neutral-200/90 hover:bg-white/4 hover:text-white"
                                  }`}
                                >
                                  <span className="block font-serif text-lg font-medium tracking-[-0.01em]">
                                    {child.label}
                                  </span>
                                  {child.description ? (
                                    <span className="mt-1 block text-xs leading-relaxed text-neutral-200/90">
                                      {child.description}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={itemKey}
                  href={item.href}
                  onClick={close}
                  style={{ animationDelay }}
                  className={`mobile-nav-item group relative flex items-center gap-5 border-b border-white/[0.07] py-5 pl-4 pr-2 transition-colors sm:gap-8 sm:py-6 ${
                    active
                      ? "bg-white/4 text-blue-50"
                      : "text-neutral-200/90 hover:bg-white/3 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-8 shrink-0 font-mono text-[0.7rem] tabular-nums tracking-widest sm:w-10 sm:text-xs ${
                      active ? "text-blue-400/90" : "text-slate-500"
                    }`}
                  >
                    {indexLabel}
                  </span>
                  <span className="min-w-0 font-serif text-[clamp(1.75rem,6vw,2.75rem)] font-medium leading-none tracking-[-0.03em]">
                    {item.label}
                  </span>
                  <span
                    className={`ml-auto text-lg text-blue-400/50 transition group-hover:translate-x-0.5 group-hover:text-blue-300/80 ${
                      active ? "text-blue-300/90" : ""
                    }`}
                    aria-hidden
                  >
                    →
                  </span>
                  {active ? (
                    <span
                      className="absolute bottom-5 left-0 top-5 w-0.5 rounded-full bg-linear-to-b from-blue-400 to-blue-600/50 sm:bottom-6 sm:top-6"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Phone Number */}
          <div className="shrink-0 space-y-4 border-t border-blue-400/15 bg-slate-900/70 px-6 py-6 backdrop-blur-sm">
            {phoneHref ? (
              <a
                href={phoneHref}
                onClick={close}
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 font-serif text-[clamp(1.75rem,6vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-slate-100 transition hover:border-blue-400/30 hover:bg-slate-900/80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-[1em] w-[1em] shrink-0 text-blue-500"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <span className="min-w-0">{orgPhoneLabel}</span>
              </a>
            ) : null}
            <p className="text-center text-[0.65rem] uppercase tracking-[0.35em] text-neutral-200/75">
              {orgName}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
