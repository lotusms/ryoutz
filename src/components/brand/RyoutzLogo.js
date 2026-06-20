import RyoutzLogoSvg from "@/components/brand/RyoutzLogoSvg";
import {
  RYOUTZ_LOGO_BLUE,
  RYOUTZ_LOGO_NEUTRAL,
} from "@/components/brand/ryoutzLogoPaths";

export { RYOUTZ_LOGO_BLUE, RYOUTZ_LOGO_NEUTRAL };

/**
 * RYoutz brand mark (inline SVG).
 *
 * @param {{
 *   className?: string;
 *   title?: string;
 *   blueColor?: string;
 *   neutralColor?: string;
 * }} props
 */
export default function RyoutzLogo({
  className = "",
  title,
  blueColor = RYOUTZ_LOGO_BLUE,
  neutralColor = RYOUTZ_LOGO_NEUTRAL,
}) {
  return (
    <RyoutzLogoSvg
      title={title ?? "R. Youtz Asphalt Maintenance"}
      blueColor={blueColor}
      neutralColor={neutralColor}
      className={`block shrink-0 object-contain object-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${className}`.trim()}
    />
  );
}
