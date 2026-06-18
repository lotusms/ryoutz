/**
 * Site-wide values that may change (brand, navigation).
 */

export const orgName = "RYoutz Asphalt Maintenance";

/** Legal / policy pages — full business name as registered or presented publicly. */
export const orgLegalName = "RYoutz Asphalt Maintenance";

export const orgPhoneTel = "+14105551234";
export const orgPhoneLabel = "(410) 555-1234";

/** Inquiries — contact form and mailto links */
export const orgInquiryEmail = "info@ryoutzasphalt.com";

/**
 * Primary site navigation — add routes alongside `src/app/.../page.js`.
 *
 * Item types:
 * - Plain link: { href, label, prefix? }
 * - Dropdown group: { label, pathPrefix, children: [...] }
 *   A group is a UI-only label — it has NO `href` and is never navigable.
 *   `pathPrefix` is used only for active-state styling (it doesn't have to
 *   resolve to a real page). Each `child` is a real link with its own route.
 *   (Former Services group lives in
 *   `src/components/nav/archived/ArchivedMainNavServicesDropdown.js`.)
 */
export const mainNav = [
  { href: "/", label: "Home" },
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
 * @returns {string} e.g. "Gallery | RYoutz Asphalt Maintenance"
 */
export function sitePageTitle(segment) {
  const s = String(segment ?? "").trim();
  if (!s) return orgName;
  return `${s} | ${orgName}`;
}

/**
 * @param {string} segment Page title segment (e.g. "Privacy Policy")
 * @returns {string} e.g. "Privacy Policy | RYoutz Asphalt Maintenance"
 */
export function siteLegalPageTitle(segment) {
  const s = String(segment ?? "").trim();
  if (!s) return orgLegalName;
  return `${s} | ${orgLegalName}`;
}
