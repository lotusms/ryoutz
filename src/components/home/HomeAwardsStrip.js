import Image from "next/image";

const BADGE_SIZE = 125;

const AWARDS = [
  {
    id: "ccc-2017",
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/awards%2Fww_2017-en_US.png?alt=media&token=c38dad5e-3594-469e-a0cc-dd10296ce7c0",
    alt: "WeddingWire Couples' Choice Awards 2017 Winner",
  },
  {
    id: "ccc-2018",
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/awards%2Fww_2018-en_US.png?alt=media&token=fca751a9-2872-4215-ac0c-fb187695deb7",
    alt: "WeddingWire Couples' Choice Awards 2018 Winner",
  },
  {
    id: "rated-25",
    src: "https://firebasestorage.googleapis.com/v0/b/ryoutz.firebasestorage.app/o/awards%2Fww_badge_25.png?alt=media&token=4a3fc332-86fe-43d4-9e17-21992e6e0b95",
    alt: "WeddingWire vendor rated badge: 25",
  },
];

function BadgeImage({ src, alt }) {
  return (
    <div className="relative h-24 w-24 sm:h-[125px] sm:w-[125px]">
      <Image
        src={src}
        alt={alt}
        width={BADGE_SIZE}
        height={BADGE_SIZE}
        className="h-full w-full object-contain"
        sizes="(max-width: 639px) 96px, 125px"
      />
    </div>
  );
}

/**
 * WeddingWire awards in a simple responsive grid (stacked on small viewports,
 * one row from `sm` up when there are three items).
 */
export default function HomeAwardsStrip({ awards = AWARDS }) {
  const list = Array.isArray(awards) && awards.length > 0 ? awards : AWARDS;

  return (
    <section
      aria-labelledby="home-awards-heading"
      className="relative z-10 overflow-hidden border-y border-blue-200/30 py-12 sm:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-linear-to-b from-amber-50 via-blue-50/70 to-amber-100/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,rgba(239,246,255,0.9),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_60%,rgba(59,130,246,0.18),transparent_50%),radial-gradient(ellipse_55%_45%_at_0%_70%,rgba(147,197,253,0.22),transparent_48%)]" />
        <div className="absolute -left-[18%] top-1/2 aspect-square w-[min(55vw,24rem)] -translate-y-1/2 rounded-full bg-blue-200/45 blur-[88px]" />
        <div className="absolute -right-[12%] top-[8%] aspect-square w-[min(48vw,20rem)] rounded-full bg-blue-300/30 blur-[96px]" />
        <div className="absolute bottom-0 left-1/2 aspect-2/1 w-[min(90%,42rem)] -translate-x-1/2 translate-y-1/3 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_85%_at_50%_50%,transparent_40%,rgba(28,25,23,0.04)_100%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-white/25" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.32em] text-amber-700/90">
          WeddingWire
        </p>
        <h2
          id="home-awards-heading"
          className="mt-2 text-center font-serif text-3xl font-medium tracking-[-0.02em] text-amber-950 sm:text-4xl"
        >
          Awards & Recognition
        </h2>

        <ul
          className="mx-auto mt-10 grid max-w-xl list-none justify-items-center gap-y-10 p-0 sm:max-w-2xl grid-cols-3"
        >
          {list.map((item) => (
            <li key={item.id}>
              <BadgeImage src={item.src} alt={item.alt} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { AWARDS };
