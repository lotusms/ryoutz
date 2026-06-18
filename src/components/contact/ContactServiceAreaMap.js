"use client";

import { useEffect, useRef } from "react";

import serviceAreaCounties from "@/data/pa-service-counties.json";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

const SERVICE_AREA_REGION_LABELS = [
  "Lancaster",
  "Dauphin (Harrisburg)",
  "York",
  "Cumberland (Carlisle, Mechanicsburg, Camp Hill)",
  "Lebanon",
];

export default function ContactServiceAreaMap() {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const containerRef = useRef(null);

  const eyebrow = light
    ? "text-[11px] font-medium uppercase tracking-[0.32em] text-amber-800"
    : "text-[11px] font-medium uppercase tracking-[0.32em] text-amber-300/90";

  const title = light
    ? "font-serif text-2xl font-medium tracking-[-0.02em] text-stone-900"
    : "font-serif text-2xl font-medium tracking-[-0.02em] text-stone-50";

  const body = light
    ? "text-sm leading-7 text-stone-600"
    : "text-sm leading-7 text-stone-300/90";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const stroke = light ? "rgba(154, 52, 18, 0.92)" : "rgba(253, 186, 116, 0.95)";
    const fill = light ? "#ea580c" : "#fb923c";

    let cancelled = false;
    const mapHolder = { current: null };

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

      try {
        if (cancelled) return;
        const layer = L.geoJSON(serviceAreaCounties, {
          style: {
            color: stroke,
            weight: 3,
            fillColor: fill,
            fillOpacity: light ? 0.32 : 0.28,
          },
          onEachFeature(feature, lyr) {
            const name = feature.properties?.name;
            const note = feature.properties?.note;
            if (name) {
              const parts = [`<strong>${name}</strong>`];
              if (note) parts.push(note);
              parts.push("Pennsylvania");
              lyr.bindPopup(parts.join("<br />"));
            }
          },
        }).addTo(map);
        map.fitBounds(layer.getBounds(), { padding: [28, 28], maxZoom: 10 });
        requestAnimationFrame(() => {
          if (!cancelled) map.invalidateSize();
        });
      } catch {
        if (!cancelled) map.setView([40.12, -76.55], 8);
      }
    })();

    return () => {
      cancelled = true;
      mapHolder.current?.remove();
      mapHolder.current = null;
    };
  }, [light]);

  return (
    <section
      aria-labelledby="contact-service-area-heading"
      className={`rounded-2xl border p-6 sm:p-8 ${
        light
          ? "border-stone-200/80 bg-white/80 shadow-sm shadow-stone-900/5"
          : "border-white/10 bg-stone-950/40 shadow-lg shadow-stone-950/30"
      }`}
    >
      <p className={eyebrow}>Where I work</p>
      <h3 id="contact-service-area-heading" className={`${title} mt-2`}>
        South‑Central Pennsylvania
      </h3>
      <p className={`${body} mt-3`}>
        Weddings and portraits throughout{" "}
        <strong className={light ? "text-stone-800" : "text-stone-100"}>
          Lancaster, Dauphin (Harrisburg), York, Cumberland, and Lebanon
        </strong>{" "}
        counties, including{" "}
        <strong className={light ? "text-stone-800" : "text-stone-100"}>
          Carlisle, Mechanicsburg, and Camp Hill
        </strong>
        .
        <br />
        If you are not in one of these counties, please contact me to see if I can travel to you.
      </p>

      <div
        ref={containerRef}
        className="mt-6 h-[min(22rem,52vh)] w-full overflow-hidden rounded-xl ring-1 ring-stone-900/15 sm:h-[min(26rem,50vh)]"
        role="presentation"
      />

      <ul
        className={`mt-6 flex list-none flex-wrap justify-center gap-x-2 gap-y-2 px-1 text-center text-xs font-medium uppercase tracking-[0.18em] sm:gap-x-3 sm:tracking-[0.2em] ${
          light ? "text-stone-600 [&>li+li]:before:text-stone-400" : "text-stone-300 [&>li+li]:before:text-stone-500"
        } [&>li]:max-w-[min(100%,22rem)] sm:[&>li]:max-w-none [&>li+li]:before:mr-2 [&>li+li]:before:inline-block [&>li+li]:before:content-['·']`}
        aria-label="Counties served"
      >
        {SERVICE_AREA_REGION_LABELS.map((label) => (
          <li key={label} className="text-balance">
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
