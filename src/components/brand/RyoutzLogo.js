import Image from "next/image";

/**
 * RYoutz brand mark — replace `public/images/brand/ryoutz-logo.png` as needed.
 *
 * @param {{
 *   className?: string;
 *   title?: string;
 * }} props
 */
export default function RyoutzLogo({ className = "", title }) {
  return (
    <Image
      src="/images/brand/ryoutz-logo.png"
      alt={title ?? "RYoutz Asphalt Maintenance"}
      width={256}
      height={256}
      className={`h-auto w-auto object-contain ${className}`.trim()}
      priority
    />
  );
}
