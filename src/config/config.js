/**
 * Site-wide values that may change (brand, navigation).
 */

export const orgName = "R. Youtz Asphalt Maintenance";

/** Legal / policy pages — full business name as registered or presented publicly. */
export const orgLegalName = "R. Youtz Asphalt Maintenance";

export const orgPhoneTel = "+17173045772";
export const orgPhoneLabel = "(717) 304-5772";

/** Inquiries — contact form and mailto links */
export const orgInquiryEmail = "info@ryoutzasphalt.com";

/** Pennsylvania counties served. */
export const serviceCounties = [
  "Dauphin County",
  "Lancaster County",
  "Lebanon County",
];

/** Prose for page copy, e.g. meta descriptions and subtitles. */
export const serviceAreaProse =
  "Dauphin, Lancaster, and Lebanon counties in Pennsylvania";

/** Compact label for footers, CTAs, and map chips. */
export const serviceAreaTagline =
  "Dauphin, Lancaster & Lebanon counties, PA";

/**
 * Primary site navigation — add routes alongside `src/app/.../page.js`.
 *
 * Item types:
 * - Plain link: { href, label, prefix? }
 * - Dropdown group: { label, pathPrefix, children: [...] }
 *   A group is a UI-only label — it has NO `href` and is never navigable.
 *   `pathPrefix` is used only for active-state styling (it doesn't have to
 *   resolve to a real page). Each `child` is a real link with its own route.
   *   (Former photography Services group lives in
   *   `src/components/nav/archived/ArchivedMainNavServicesDropdown.js`.)
 */
export const mainNav = [
  { href: "/", label: "Home" },
  {
    label: "Services",
    pathPrefix: "/services",
    children: [
      {
        href: "/services/sealcoating",
        label: "Sealcoating",
        description: "Single-coat coal tar sealer applied by brush for a longer-lasting finish.",
      },
      {
        href: "/services/crack-filling",
        label: "Crack Filling",
        description: "Hot poly fiber tar crack filling heated to 370–390°F.",
      },
      {
        href: "/services/line-painting",
        label: "Line Painting",
        description: "Crisp striping for lots, lanes, and traffic markings.",
      },
      {
        href: "/services/pavement-maintenance",
        label: "Pavement Maintenance",
        description: "Ongoing care to extend the life of your pavement.",
      },
    ],
  },
  { href: "/gallery", label: "Gallery", prefix: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const homeLensHeroFilenames = [
  "parkinglot.png",
  "homedriveway.png",
  "crackfilling.png",
];

/**
 * @param {string} segment Page title segment (e.g. "Gallery", "Contact")
 * @returns {string} e.g. "Gallery | R. Youtz Asphalt Maintenance"
 */
export function sitePageTitle(segment) {
  const s = String(segment ?? "").trim();
  if (!s) return orgName;
  return `${s} | ${orgName}`;
}

/**
 * @param {string} segment Page title segment (e.g. "Privacy Policy")
 * @returns {string} e.g. "Privacy Policy | R. Youtz Asphalt Maintenance"
 */
export function siteLegalPageTitle(segment) {
  const s = String(segment ?? "").trim();
  if (!s) return orgLegalName;
  return `${s} | ${orgLegalName}`;
}
