/**
 * Folders under `public/` that are read at runtime via `fs.readdirSync`
 * (`getHomeLensHeroImagePaths` on the home page). Vercel's file tracer
 * only bundles statically imported files into a serverless function;
 * runtime `fs` calls return an empty listing in production unless we
 * explicitly opt those files in here.
 *
 * Gallery images are no longer read from disk — they live in Firebase
 * Storage and are referenced by URLs stored in the Firestore `gallery`
 * collection (see `src/lib/gallery-firestore.js`).
 */
const homeHeroAssetsGlob = "./public/images/home-lens-hero-images/**/*";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Tell Next.js' file tracer to include these `public/` folders in each
   * function bundle. Keys are App Router route patterns (route groups like
   * `(main)` are NOT part of the key — use the public URL path).
   */
  outputFileTracingIncludes: {
    "/": [homeHeroAssetsGlob],
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/gallery", permanent: true },
      { source: "/shop/:slug", destination: "/gallery/:slug", permanent: true },
    ];
  },
  // Dev tooling is mounted once at the App Router root (wraps every route: /, /gallery,
  // /login, /dashboard, etc.). It is not part of the dashboard layout — so any stuck
  // dev overlay affects the whole site. `devIndicators: false` hides the on-canvas
  // indicator (Next 16 docs); restart `next dev` after changing this.
  devIndicators: false,
  // Keep Turbopack explicit for Next.js 16+ build compatibility on Vercel.
  turbopack: {},
  // External / network volumes often break native file watchers; polling keeps HMR reliable.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  images: {
    /** Vercel + `next/image` resize + WebP/AVIF (Lighthouse “properly size” / modern formats). */
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    /**
     * Next 16 requires every `quality` value passed to `<Image>` to be allow-listed here.
     * Keep this list minimal — each quality is a separate CDN cache key.
     *   75 — Next/Image implicit default when no `quality` prop is set
     *   80 — `CoverImageFrame` default (catalog tiles, galleries, hero art)
     *   82 — `HomeHeroArtRotator`
     *   88 — `HomeLensCarouselHero`
     */
    qualities: [75, 80, 82, 88],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.metmuseum.org",
        port: "",
        pathname: "/CRDImages/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "cdn0.weddingwire.com",
        pathname: "/user/**",
      },
    ],
  },
};

export default nextConfig;
