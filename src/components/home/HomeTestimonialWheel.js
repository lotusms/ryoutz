"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

const TESTIMONIALS = [
  {
    id: "greg",
    name: "Greg",
    role: "Homeowner · Dauphin County, PA",
    image: "/images/testimonials/greg.png",
    quote:
      "Tyler was honest when our driveway wasn't ready to seal. He had us wait a year and filled a few cracks in the meantime. The 2025 coal tar job gave us the uniform, flat finish I wanted, with clean edges and no splatter on the garage or sidewalks. Excellent work and one of the best prices in the area.",
  },
  {
    id: "damien",
    name: "Damien",
    role: "Homeowner · Lancaster County, PA",
    image: "/images/testimonials/damian.jpeg",
    quote:
      "Huge thanks to R.Youtz for bringing our driveway back to life with a fresh new look. Don't hesitate to reach out for an estimate. They were great from start to finish. I'd highly recommend them to anyone looking to get their driveway sealed.",
  },
  {
    id: "frank",
    name: "Frank",
    role: "Homeowner · Lebanon County, PA",
    image: "/images/testimonials/frank.jpeg",
    quote:
      "Tyler resealed our driveway a few years ago and it still looks like it was just done. If you need your driveway resealed, give him a call. The price was very reasonable. Professional, friendly, and always prompt getting back to you.",
  },
  {
    id: "denyse",
    name: "Denyse",
    role: "Homeowner · Dauphin County, PA",
    image: "/images/testimonials/denyse.jpeg",
    quote:
      "Extremely pleased with our recent sealing job. The results were amazing. The price was very reasonable and the turnaround from first contact to completion was much quicker than I expected. Would highly recommend.",
  },
  {
    id: "teresa-williams",
    name: "Teresa Williams",
    role: "HOA Board · Lancaster County, PA",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    quote:
      "We signed up for a maintenance plan for our private road and parking areas. Inspections are documented, repairs happen before small issues become big ones, and the board finally has a pavement budget we can trust.",
  },
  {
    id: "robert-kim",
    name: "Robert Kim",
    role: "Small Business Owner · Dauphin County, PA",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "Handicap spaces, fire lane markings, and aisle stripes, all sharp and compliant. Customers notice when a lot looks maintained. This crew treated our storefront pavement like it mattered.",
  },
  {
    id: "angela-morris",
    name: "Angela Morris",
    role: "Homeowner · Dauphin County, PA",
    image: "https://randomuser.me/api/portraits/women/57.jpg",
    quote:
      "They barricaded the driveway, walked us through cure time, and checked back after the first rain. The sealer held even color and the edges look hand-cut, not sprayed over the lawn.",
  },
  {
    id: "vincent-cole",
    name: "Vincent Cole",
    role: "Facility Director · Lebanon County, PA",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    quote:
      "Patching, crack seal, and a full sealcoat cycle on our church lot. Scheduled around Sunday traffic and finished without disrupting services. Clear communication every step of the way.",
  },
  {
    id: "sarah-nguyen",
    name: "Sarah Nguyen",
    role: "Homeowner · Lancaster County, PA",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    quote:
      "Got three quotes. R. Youtz was the only one that explained prep in detail instead of just quoting a gallon count. The finished driveway is even, dark, and ready for Pennsylvania weather.",
  },
];

const ROTATE_MS = 5500;
const TRANSITION_MS = 1400;
const ROTATE_EASE = "cubic-bezier(0.6, 0.05, 0.2, 1)";

/** Returns true once the component has mounted on the client; false during SSR. */
const noopSubscribe = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function initialsFor(name) {
  return String(name || "")
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function Avatar({ testimonial, isActive }) {
  const mounted = useHasMounted();
  const [failed, setFailed] = useState(false);
  const showImage = mounted && Boolean(testimonial.image) && !failed;

  const wellClass = "bg-slate-800 text-blue-100";

  const ringActive =
    "border-blue-400 shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/30";

  const ringIdle = "border-white/15 shadow-sm shadow-black/20";

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[28%] border-2 transition duration-700 ${
        isActive
          ? `scale-[1.08] ${ringActive}`
          : `scale-100 opacity-80 group-hover:opacity-100 ${ringIdle}`
      }`}
    >
      {showImage ? (
        <Image
          src={testimonial.image}
          alt={`Portrait of ${testimonial.name}`}
          fill
          sizes="(max-width: 640px) 64px, 96px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.18em] ${wellClass}`}
          aria-hidden="true"
        >
          {initialsFor(testimonial.name)}
        </div>
      )}
    </div>
  );
}

export default function HomeTestimonialWheel({ testimonials = TESTIMONIALS }) {
  const items = useMemo(
    () => (Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : TESTIMONIALS),
    [testimonials],
  );
  const n = items.length;

  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** Bumps on manual navigation so the interval restarts and cannot double-fire with a tick. */
  const [autoAdvanceEpoch, setAutoAdvanceEpoch] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (n <= 1 || paused || reducedMotion) return undefined;
    const id = window.setInterval(() => {
      setStep((s) => s + 1);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [n, paused, reducedMotion, autoAdvanceEpoch]);

  const wheelRotation = step * (360 / n);
  const active = ((n - (step % n)) % n + n) % n;
  const transition = reducedMotion ? "none" : `transform ${TRANSITION_MS}ms ${ROTATE_EASE}`;

  function bumpAutoAdvanceEpoch() {
    setAutoAdvanceEpoch((e) => e + 1);
  }

  function jumpTo(i) {
    const delta = ((active - i) % n + n) % n;
    if (delta === 0) return;
    setStep((s) => s + delta);
    bumpAutoAdvanceEpoch();
  }

  /** Wheel rotates CW when `step` increases, so `next` advances and `prev` rewinds. */
  function next() {
    setStep((s) => s + 1);
    bumpAutoAdvanceEpoch();
  }
  function prev() {
    setStep((s) => s - 1);
    bumpAutoAdvanceEpoch();
  }

  const eyebrow =
    "text-xs font-medium uppercase tracking-[0.32em] text-blue-300/90";

  const heading =
    "font-serif text-3xl font-medium tracking-[-0.02em] text-neutral-100 sm:text-4xl";

  const role = "mt-1 text-sm text-neutral-200/75";

  const quote = "mt-6 text-base leading-8 text-neutral-200/90";

  const quoteMark = "text-blue-400/70";

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className="relative z-10 w-full overflow-hidden border-y border-white/10 py-16 sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_0%,rgba(29,78,216,0.16),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(15,23,42,0.85),transparent_50%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-12">
        <div
          className="relative mx-auto aspect-square w-full max-w-[340px] [--avatar:4rem] [--radius:8.5rem] sm:max-w-[420px] sm:[--avatar:5rem] sm:[--radius:10.5rem] lg:max-w-[460px] lg:[--avatar:5.5rem] lg:[--radius:11.5rem]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}>
          <div
            className="relative h-full w-full"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition,
            }}
          >
            {items.map((t, i) => {
              const itemAngle = (i * 360) / n;
              const isActive = i === active;
              return (
                <button
                  type="button"
                  key={t.id ?? t.name}
                  onClick={() => jumpTo(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-pressed={isActive}
                  className="group absolute left-1/2 top-1/2 rounded-[28%] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  style={{
                    width: "var(--avatar)",
                    height: "var(--avatar)",
                    transform: `translate(-50%, -50%) rotate(${itemAngle}deg) translateX(var(--radius)) rotate(${-(itemAngle + wheelRotation)}deg)`,
                    transition,
                  }}
                >
                  <Avatar testimonial={t} isActive={isActive} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <p className={eyebrow}>What our clients say</p>
          <div
            className="relative mt-6 min-h-80 sm:min-h-72"
            aria-live="polite"
            aria-atomic="true"
          >
            {items.map((t, i) => {
              const isActive = i === active;
              return (
                <article
                  key={t.id ?? t.name}
                  aria-hidden={!isActive}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <h3 className={heading}>{t.name}</h3>
                  {t.role ? <p className={role}>{t.role}</p> : null}
                  <blockquote className={quote}>
                    <span className={quoteMark} aria-hidden="true">&ldquo;</span>
                    {t.quote}
                    <span className={quoteMark} aria-hidden="true">&rdquo;</span>
                  </blockquote>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Testimonial selector"
            >
              {items.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={`dot-${t.id ?? t.name}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Show testimonial ${i + 1} of ${n}`}
                    onClick={() => jumpTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? "w-8 bg-blue-400"
                        : "w-3 bg-white/20 hover:bg-white/35"
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-7 sm:gap-9">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="group inline-flex items-center gap-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-200/70 transition-colors duration-300 hover:text-neutral-100 focus:outline-none focus-visible:text-neutral-100"
              >
                <svg
                  viewBox="0 0 40 12"
                  className="h-2.5 w-10 transition-transform duration-500 ease-out group-hover:-translate-x-1.5 group-focus-visible:-translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M40 6 L1 6" />
                  <path d="M6 1 L1 6 L6 11" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="group inline-flex items-center gap-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-200/70 transition-colors duration-300 hover:text-neutral-100 focus:outline-none focus-visible:text-neutral-100"
              >
                <svg
                  viewBox="0 0 40 12"
                  className="h-2.5 w-10 transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M0 6 L39 6" />
                  <path d="M34 1 L39 6 L34 11" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
