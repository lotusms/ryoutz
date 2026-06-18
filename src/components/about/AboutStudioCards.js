"use client";

import Image from "next/image";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { ARTWORK_MAT_INNER, ARTWORK_MAT_OUTER } from "@/components/ui/artworkMatClasses";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { isLightThemeId } from "@/theme";

const PHOTOS = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/about%2FAnthony7.png?alt=media&token=62b45928-44e1-4078-954f-91494fb2917b",
    alt: "Portrait of RYoutz Asphalt Maintenance with his dog, Ruby",
    sizes: "(max-width: 1024px) min(92vw, 32rem), (max-width: 1280px) 46vw, 840px",
    quality: 100,
    priority: true,
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/about%2Fanthony2.jpg?alt=media&token=ad3e8332-c600-451f-a396-9f455043eb07",
    alt: "RYoutz Asphalt Maintenance behind the camera",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw",
    quality: 100,
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/about%2Fanthony1.jpg?alt=media&token=0a4a9a1d-e545-4fd3-a652-6510595a0aab",
    alt: "RYoutz Asphalt Maintenance photographing with a professional camera",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw",
    quality: 100,
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/about%2Fanthony4.jpg?alt=media&token=78d8be1c-9403-4a93-a7c6-f5bfe495e46c",
    alt: "RYoutz Asphalt Maintenance at work",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw",
    quality: 100,
  }, 
];

/**
 * Personal about section — photography studio, not product cards.
 *
 * @param {{ orgName: string; principles: { title: string; body: string }[] }} props
 */
export default function AboutStudioCards({ orgName, principles }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);

  const body = light ? "text-stone-800/95" : "text-stone-200/90";
  const lead = light ? "text-stone-700" : "text-stone-300/90";
  const quote = light ? "text-stone-900" : "text-stone-100";
  const muted = light ? "text-stone-600" : "text-stone-500";
  const label = light ? "text-amber-900/90" : "text-amber-300/90";
  const pillarBorder = light ? "border-stone-300/60" : "border-white/10";

  const [hero, ...rest] = PHOTOS;

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      {/* Hero: portrait + voice — same matted frame as gallery cards */}
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <figure className="relative mx-auto w-full max-w-md shadow-2xl shadow-stone-950/40 lg:mx-0 lg:max-w-none">
          <div className={ARTWORK_MAT_OUTER}>
            <div className={`${ARTWORK_MAT_INNER} aspect-3/4`}>
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes={hero.sizes}
                quality={hero.quality}
                className="object-cover object-center"
              />
            </div>
          </div>
        </figure>

        <div className="max-w-xl lg:max-w-none">
          <p className={`text-xs font-medium uppercase tracking-[0.32em] ${label}`}>
            The person behind the photographs
          </p>
          <p className={`mt-6 font-serif text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-3xl ${quote}`}>
            I am not here to stage your love, but to notice it.
          </p>
          <p className={`mt-6 text-base leading-8 ${lead}`}>
            {orgName} is a wedding and portrait photographer who believes the best frames happen when you forget someone is holding a camera. Quiet mornings, loud dance floors, the breath before the aisle: that is the work. No mood boards that erase who you are, no rush to the next shot list, just patience, warmth, and images you will still want to open in twenty years.
          </p>
          <p className={`mt-5 text-base leading-8 ${body}`}>
            When you look through this site, you are seeing real couples and real light. If that sounds like the way you want to remember your day, I would love to hear your story.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryButton href="/contact">Say hello</PrimaryButton>
            <SecondaryButton href="/gallery">Browse the gallery</SecondaryButton>
          </div>
        </div>
      </div>

      {/* Secondary images — same matted frame as gallery cards */}
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {rest.map((photo, i) => (
          <figure
            key={photo.src}
            className="relative shadow-lg shadow-stone-950/40"
          >
            <div className={ARTWORK_MAT_OUTER}>
              <div className={`${ARTWORK_MAT_INNER} aspect-4/5 sm:aspect-3/4`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={photo.sizes}
                  quality={photo.quality}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-cover object-center"
                />
              </div>
            </div>
          </figure>
        ))}
      </div>

      {/* Pull quote — editorial, not a “mission statement” card */}
      <blockquote
        className={`relative border-l-2 pl-8 sm:pl-10 ${
          light ? "border-amber-600/40" : "border-amber-400/35"
        }`}
      >
        <p
          className={`font-serif text-xl font-medium italic leading-relaxed sm:text-2xl lg:text-[1.65rem] lg:leading-snug ${quote}`}
        >
          Your wedding is not a brand shoot. It is a day that only happens once, and the pictures should feel like yours, not a template someone else picked.
        </p>
        <footer className={`mt-5 text-xs uppercase tracking-[0.28em] ${muted}`}>
          — {orgName}
        </footer>
      </blockquote>

      {/* Values — simple columns, no inset product cards */}
      <div>
        <p className={`text-xs font-medium uppercase tracking-[0.32em] ${label}`}>
          How I work
        </p>
        <div className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {principles.map((item) => (
            <div
              key={item.title}
              className={`border-t pt-6 ${pillarBorder}`}
            >
              <h3 className={`font-serif text-xl font-bold tracking-[-0.02em] ${quote}`}>
                {item.title}
              </h3>
              <p className={`mt-3 text-sm leading-7 ${body}`}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
