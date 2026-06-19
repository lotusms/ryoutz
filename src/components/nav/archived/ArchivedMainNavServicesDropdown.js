"use client";

import Link from "next/link";

import NavDropdown from "@/components/nav/NavDropdown";

/** Same shape as the former first entry in `mainNav` (kept in archive module). */
export const SERVICES_MAIN_NAV_GROUP = {
  label: "Services",
  pathPrefix: "/services",
  children: [
    {
      href: "/services/weddings",
      label: "Weddings",
      description: "Wedding days, captured the way they really felt.",
    },
    {
      href: "/services/events",
      label: "Events",
      description: "Galas, parties, and milestones, calmly covered.",
    },
    {
      href: "/services/sporting-events",
      label: "Sporting Events",
      description: "On-the-action coverage for teams and athletes.",
    },
    {
      href: "/services/commercial",
      label: "Commercial",
      description: "Brand, product, and editorial photography.",
    },
  ],
};

function isActivePath(pathname, href, prefix) {
  if (prefix) return pathname === href || pathname.startsWith(`${href}/`);
  if (href === "/") return pathname === "/";
  return pathname === href;
}

export function navItemKey(item) {
  return item.href ?? `group:${item.label}`;
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

export default function ArchivedMainNavServicesDropdown() {
  return <NavDropdown item={SERVICES_MAIN_NAV_GROUP} />;
}

export function ArchivedMainNavServicesMobileNavItem({
  pathname,
  open,
  close,
  mobileExpanded,
  setMobileExpanded,
  index,
  item = SERVICES_MAIN_NAV_GROUP,
}) {
  const active = isNavItemActive(pathname, item);
  const animationDelay = open ? `${70 + index * 55}ms` : "0ms";
  const indexLabel = String(index + 1).padStart(2, "0");
  const itemKey = navItemKey(item);
  const expanded = mobileExpanded === itemKey;

  return (
    <div className="border-b border-white/[0.07]">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() =>
          setMobileExpanded((prev) => (prev === itemKey ? null : itemKey))
        }
        style={{ animationDelay }}
        className={`mobile-nav-item group relative flex w-full items-center gap-5 py-5 pl-4 pr-2 text-left transition-colors sm:gap-8 sm:py-6 ${
          active
            ? "bg-white/4 text-blue-50"
            : "text-amber-50 hover:bg-white/3 hover:text-white"
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
                        : "text-amber-200 hover:bg-white/4 hover:text-white"
                    }`}
                  >
                    <span className="block font-serif text-lg font-medium tracking-[-0.01em]">
                      {child.label}
                    </span>
                    {child.description ? (
                      <span className="mt-1 block text-xs leading-relaxed text-amber-400">
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
