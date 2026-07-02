import {
  facebookPageUrl,
  orgInquiryEmail,
  orgLegalName,
  orgName,
  orgPhoneTel,
  serviceAreaProse,
  serviceCounties,
  siteDefaultUrl,
} from "@/config/config.js";

/** Default Open Graph / social preview image (absolute URL built at runtime). */
export const DEFAULT_OG_IMAGE_PATH = "/images/Owners.jpeg";

/** @returns {string} Canonical site origin, no trailing slash. */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const raw = fromEnv || siteDefaultUrl;
  return raw.replace(/\/$/, "");
}

/** @param {string} [path] */
export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

/** @param {string} [path] */
export function absoluteAssetUrl(path) {
  if (!path) return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

/**
 * @param {{
 *   title: string;
 *   description: string;
 *   path?: string;
 *   image?: string;
 *   imageAlt?: string;
 *   noIndex?: boolean;
 *   type?: "website" | "article";
 * }} opts
 */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE_PATH,
  imageAlt = orgName,
  noIndex = false,
  type = "website",
}) {
  const pageTitle = title.includes(orgName) ? title : `${title} | ${orgName}`;
  const url = absoluteUrl(path);
  const ogImage = absoluteAssetUrl(image);
  const desc = String(description ?? "").trim().slice(0, 160);

  return {
    title: pageTitle,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: desc,
      url,
      siteName: orgName,
      locale: "en_US",
      type,
      images: [
        {
          url: ogImage,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** @returns {Record<string, unknown>} */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: orgLegalName,
    url: getSiteUrl(),
    image: absoluteAssetUrl(DEFAULT_OG_IMAGE_PATH),
    logo: absoluteUrl("/favicon/web-app-manifest-512x512.png"),
    telephone: orgPhoneTel,
    email: orgInquiryEmail,
    description: `Professional asphalt maintenance, sealcoating, crack filling, and line striping in ${serviceAreaProse}.`,
    areaServed: serviceCounties.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      addressRegion: "PA",
      addressCountry: "US",
    },
    sameAs: [facebookPageUrl],
    priceRange: "$$",
  };
}

/** @returns {Record<string, unknown>} */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: orgName,
    url: getSiteUrl(),
    publisher: {
      "@type": "Organization",
      name: orgLegalName,
      url: getSiteUrl(),
    },
  };
}

/**
 * @param {{ name: string; path: string }[]} items
 * @returns {Record<string, unknown>}
 */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Static marketing routes included in the sitemap. */
export const SITEMAP_STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.95, changeFrequency: "monthly" },
  { path: "/connect", priority: 0.85, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.9, changeFrequency: "weekly" },
  { path: "/gallery/before-after", priority: 0.85, changeFrequency: "monthly" },
  { path: "/services/sealcoating", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/crack-filling", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/line-painting", priority: 0.85, changeFrequency: "monthly" },
  {
    path: "/services/pavement-maintenance",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-of-use", priority: 0.3, changeFrequency: "yearly" },
];
