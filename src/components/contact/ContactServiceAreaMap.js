"use client";

import { useEffect, useRef } from "react";

import Card from "@/components/ui/Card";
import { serviceAreaProse, serviceAreaTagline, serviceCounties } from "@/config";

/** Center of Dauphin, Lancaster, and Lebanon counties. */
const SERVICE_AREA_CENTER = [40.22, -76.45];
const SERVICE_AREA_ZOOM = 9;

export default function ContactServiceAreaMap() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const mapHolder = { current: null };

    const invalidate = () => {
      if (!cancelled) mapHolder.current?.invalidateSize();
    };

    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(el);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) invalidate();
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(el);

    (async () => {
      await import("leaflet/dist/leaflet.css");
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      mapHolder.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.setView(SERVICE_AREA_CENTER, SERVICE_AREA_ZOOM);
      requestAnimationFrame(invalidate);
      window.setTimeout(invalidate, 150);
    })();

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      mapHolder.current?.remove();
      mapHolder.current = null;
    };
  }, []);

  return (
    <Card
      variant="inset"
      className="min-w-0 w-full !backdrop-blur-none"
      aria-labelledby="contact-service-area-heading"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-blue-300/90">
        Service area
      </p>
      <h3
        id="contact-service-area-heading"
        className="mt-2 font-serif text-2xl font-bold tracking-[-0.02em] text-blue-400"
      >
        {serviceAreaTagline}
      </h3>
      <p className="mt-3 text-sm leading-7 text-neutral-200/90">
        Driveways, parking lots, and private roads throughout{" "}
        <strong className="font-semibold text-neutral-100">
          {serviceAreaProse}
        </strong>
        .
        <br />
        Outside our usual routes? Send your address — we will let you know if we can schedule a visit.
      </p>

      <div
        ref={containerRef}
        className="relative isolate z-0 mt-6 h-[min(22rem,52vh)] w-full overflow-hidden rounded-xl bg-slate-950/40 ring-1 ring-white/10 sm:h-[min(26rem,50vh)] [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full"
        role="presentation"
      />

      <ul
        className="mt-6 flex list-none flex-wrap justify-center gap-x-2 gap-y-2 px-1 text-center text-xs font-medium uppercase tracking-[0.18em] text-neutral-200/90 sm:gap-x-3 sm:tracking-[0.2em] [&>li]:max-w-[min(100%,22rem)] sm:[&>li]:max-w-none [&>li+li]:before:mr-2 [&>li+li]:before:inline-block [&>li+li]:before:text-neutral-500 [&>li+li]:before:content-['·']"
        aria-label="Regions served"
      >
        {serviceCounties.map((label) => (
          <li key={label} className="text-balance">
            {label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
