import Image from "next/image";

/**
 * Full-width hero image for service pages — sits beneath the fixed header.
 *
 * @param {{
 *   src: string;
 *   alt: string;
 *   objectPosition?: string;
 * }} props
 */
export default function ServicePageHero({
  src,
  alt,
  objectPosition = "center",
}) {
  return (
    <div className="relative -mt-16 w-full overflow-hidden">
      <div className="relative h-[min(55vh,28rem)] w-full sm:h-[min(60vh,34rem)] lg:h-[min(65vh,38rem)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          quality={88}
          className="object-cover"
          style={{ objectPosition }}
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden bg-linear-to-r from-black/25 via-transparent to-transparent sm:block"
          aria-hidden
        />
      </div>
    </div>
  );
}
