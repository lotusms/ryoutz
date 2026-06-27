"use client";

import Image from "next/image";

import PrimaryButton from "@/components/ui/PrimaryButton";
import PullQuote from "@/components/ui/PullQuote";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { serviceAreaProse } from "@/config";
import { ARTWORK_MAT_INNER, ARTWORK_MAT_OUTER } from "@/components/ui/artworkMatClasses";

const PROJECT_PHOTOS = [
  {
    src: "/images/Owners.jpeg",
    alt: "R. Youtz Asphalt Maintenance owners",
    sizes: "(max-width: 1024px) min(92vw, 32rem), (max-width: 1280px) 46vw, 840px",
    quality: 88,
    priority: true,
  },
  {
    src: "/images/gallery/work/gal2.png",
    alt: "Residential driveway sealcoating project",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw",
    quality: 88,
  },
  {
    src: "/images/gallery/work/gal11.png",
    alt: "Sealcoating crew finishing a driveway",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw",
    quality: 88,
  },
  {
    src: "/images/gallery/work/gal12.png",
    alt: "Fresh sealcoat on asphalt pavement",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw",
    quality: 88,
  },
];

/**
 * About section — company story, project imagery, and working principles.
 *
 * @param {{ orgName: string; principles: { title: string; body: string }[] }} props
 */
export default function AboutStudioCards({ orgName, principles }) {
  const [hero, ...rest] = PROJECT_PHOTOS;

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <figure className="relative mx-auto w-full max-w-md shadow-2xl shadow-amber-950/40 lg:mx-0 lg:max-w-none">
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
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-blue-300/90">
            Who we are
          </p>
          <p className="mt-6 font-serif text-2xl font-medium leading-snug tracking-[-0.02em] text-neutral-200/90 sm:text-3xl">
            We treat every driveway like it is our own.
          </p>
          <p className="mt-6 text-base leading-8 text-neutral-100/90">
            Our grandfather started {orgName} in the 1960s. Today we are the third generation,
            and the business has stayed family owned the entire way. We serve {serviceAreaProse}{" "}
            with sealcoating, crack repair, patching, and line striping for driveways, parking
            lots, and private roads.
          </p>
          <p className="mt-6 text-base leading-8 text-neutral-100/90">
            One of the worst things you can do to a driveway is overseal it. Applying sealer too
            often can shorten the life of your pavement and lead to a full replacement years
            sooner than necessary. We will always be upfront with you. If your driveway can
            safely wait another season, we will say so and help you plan work when it truly needs
            to be done and when it will actually benefit the surface.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryButton href="/contact">Get a free estimate</PrimaryButton>
            <SecondaryButton href="/gallery">See our work</SecondaryButton>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {rest.map((photo, i) => (
          <figure
            key={photo.src}
            className="relative shadow-lg shadow-amber-950/40"
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

      <PullQuote
        quote="Every lot and driveway is different. The right fix depends on how the pavement was built, how it is used, and what the weather has already done to it — not a one-size-fits-all package."
        attribution={orgName}
      />

      <div>
        <p className="text-xs font-bold font-serif uppercase tracking-[0.32em] text-blue-300/90">
          How we work
        </p>
        <div className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {principles.map((item) => (
            <div key={item.title} className="border-t border-white/10 pt-6">
              <h3 className="font-serif text-base font-bold tracking-[-0.02em] text-blue-400">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-200/90">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
