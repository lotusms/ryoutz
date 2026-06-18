"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import GoldSpectrumBackdrop from "@/components/ui/GoldSpectrumBackdrop";

const TESTIMONIALS = [
  {
    name: "Iman & Nick",
    role: "Married September 2020",
    image: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2Fiman-nick.png?alt=media&token=2250ee47-8033-4c6d-9e0f-a59f6506d7d2",
    quote:
      "We had our wedding September 2020. Anthony was amazing. It was a very stressful time to have a wedding, but once talking to him through our vision, he filled in all the gaps and helped us to relax and enjoy our day. I had no idea how amazingly supportive he would be.",
  },
  {
    name: "Madilyn & Wyatt",
    role: "Married May 2024",
    image: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2FMadilyn_Wyatt.png?alt=media&token=d4d9f45d-5c02-449d-89f4-c1b4660145f1",
    quote:
      "Anthony & Chris were spectacular! Anthony was great with communicating throughout the entire process. He made great suggestions at our one month pre-wedding meeting. I would recommend them to anyone!!",
  },
  {
    name: "Christopher & Stephanie",
    role: "Married July 2018",
    image: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2Fchristopher_stephanie.png?alt=media&token=21fe88e7-2aa5-426e-9034-c9d68d74a15f",
    quote:
      "We couldn't have asked for a better video team. AM Films knew the rhythm of the day, stayed in close touch with us, and coordinated with our DJ and photographer so microphones, speeches, and coverage never stepped on each other. That professionalism made everything feel simple and smooth.",
  },
  {
    name: "John & Tori",
    role: "Married April 2025",  
    image: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2FJohn-Tori.png?alt=media&token=842a238f-b69f-463b-9fdc-c798ddb2023c",
    quote:
      "We almost skipped video for budget reasons until my mom helped us hire AM Films—meeting Anthony made it feel like the obvious yes. He showed up early, felt like a friend we'd known forever, and our highlight and full film still make us laugh and cry like the wedding itself. We'd recommend him to anyone who wants a cinematic recap from someone who truly cares.",
  }, 
  {
    name: "Justin & Misha",
    role: "Married June 2024",
    image: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2FJustin.png?alt=media&token=ce2b4c08-f38b-4248-9c70-842cb5dfd409",
    quote:
      "When we got engaged, finding the right videographer felt essential—video would shape how we remembered the day. A few early conversations elsewhere didn't measure up, but once we were referred to Anthony, his work online was the first that felt unmistakably right.",
  },
  {
    name: "Camri & Kelvin",
    role: "Married April 2021",
    image:
      "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2Fcamri.png?alt=media&token=56d6f374-0d8c-443a-9e31-6fe6a1fd1469",
    quote:
      "We hired Anthony in 2019 for our April 2020 wedding. When Maryland shut down four weeks before our date, he was kind and steady while everything was upside down—and we knew we still wanted him with us. Our smaller day and highlight reel turned out perfect; we recommend him without hesitation and can't wait for him to capture our big celebration too.",
  },
  {
    name: "Francisco & Genesis",
    role: "Married September 2025",
    image: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2FFrancisco_Genesis.png?alt=media&token=a4d5a24c-edf0-42ed-b390-b5fa55a71e10",
    quote:
      "Meeting Anthony in person put us at ease right away—he understood our vision, planned with us patiently, and showed up early on the wedding day ready to help wherever needed. He went above and beyond on the day and kept working after until the film was something our families will cherish. We'd hire him a hundred times over.",
  },
  {
    name: "Jakob Owens",
    role: "Married October 2023",
    image: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/testimonials%2Fj_owens.png?alt=media&token=c1cbb267-d9e4-4de7-8aae-a3849c624413",
    quote:
      "Neither of us is comfortable in front of a camera. By the second hour we forgot it existed. By the time the gallery arrived, we understood why everyone we know who's worked with him cried when they opened theirs.",
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

  const wellClass = "bg-stone-900/90 text-amber-100";

  const ringActive =
    "border-stone-900 shadow-lg shadow-stone-900/25 ring-2 ring-stone-900/20";

  const ringIdle = "border-stone-900/35 shadow-sm shadow-stone-900/10";

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
    "text-xs uppercase tracking-[0.32em] text-stone-800/90";

  const heading =
    "font-serif text-3xl font-medium tracking-[-0.02em] text-stone-950 sm:text-4xl";

  const role = "mt-1 text-sm text-stone-800/80";

  const quote = "mt-6 text-base leading-8 text-stone-900";

  const quoteMark = "text-stone-700/70";

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className="relative z-10 w-full overflow-hidden py-16 sm:py-20"
    >
      <GoldSpectrumBackdrop />

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
                  key={t.name}
                  onClick={() => jumpTo(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-pressed={isActive}
                  className="group absolute left-1/2 top-1/2 rounded-[28%] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/50 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-100/80"
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
          <p className={eyebrow}>Voices from the day</p>
          <div
            className="relative mt-6 min-h-80 sm:min-h-72"
            aria-live="polite"
            aria-atomic="true"
          >
            {items.map((t, i) => {
              const isActive = i === active;
              return (
                <article
                  key={t.name}
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
                    key={`dot-${t.name}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Show testimonial ${i + 1} of ${n}`}
                    onClick={() => jumpTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? "w-8 bg-stone-900"
                        : "w-3 bg-stone-900/30 hover:bg-stone-900/50"
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
                className="group inline-flex items-center gap-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-stone-900/70 transition-colors duration-300 hover:text-stone-950 focus:outline-none focus-visible:text-stone-950"
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
                className="group inline-flex items-center gap-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-stone-900/70 transition-colors duration-300 hover:text-stone-950 focus:outline-none focus-visible:text-stone-950"
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
