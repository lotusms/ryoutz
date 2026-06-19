import {
  RYOUTZ_LOGO_BLUES_PATH,
  RYOUTZ_LOGO_BLUE,
  RYOUTZ_LOGO_NEUTRAL,
  RYOUTZ_LOGO_NEUTRALS_PATH,
  RYOUTZ_LOGO_VIEWBOX,
} from "@/components/brand/ryoutzLogoPaths";

/**
 * Inline SVG wordmark — matches `public/images/ryoutz-logo.svg`.
 *
 * @param {{
 *   className?: string;
 *   title?: string;
 *   blueColor?: string;
 *   neutralColor?: string;
 * }} props
 */
export default function RyoutzLogoSvg({
  className = "",
  title = "R. Youtz Asphalt Maintenance",
  blueColor = RYOUTZ_LOGO_BLUE,
  neutralColor = RYOUTZ_LOGO_NEUTRAL,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={RYOUTZ_LOGO_VIEWBOX}
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <path id="Blues" fill={blueColor} d={RYOUTZ_LOGO_BLUES_PATH} />
      <path id="Neutrals" fill={neutralColor} d={RYOUTZ_LOGO_NEUTRALS_PATH} />
    </svg>
  );
}
