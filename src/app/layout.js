import { Geist, Geist_Mono } from "next/font/google";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";
import { orgLegalName, orgName, serviceAreaProse } from "@/config";
import { ACTIVE_THEME_ID } from "@/theme";
import { absoluteUrl, buildPageMetadata, getSiteUrl } from "@/lib/seo";
import "./globals.css";
import "@/theme/themes.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const defaultDescription = `${orgLegalName} provides professional sealcoating, crack filling, line striping, and pavement maintenance for driveways, parking lots, and private roads in ${serviceAreaProse}.`;

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildPageMetadata({
    title: orgName,
    description: defaultDescription,
    path: "/",
  }),
  title: {
    default: orgName,
    template: `%s | ${orgName}`,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: absoluteUrl("/favicon/site.webmanifest"),
  category: "business",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme={ACTIVE_THEME_ID}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className="flex min-h-dvh flex-col overflow-x-clip bg-site-bg font-sans text-site-fg"
        suppressHydrationWarning
      >
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  );
}
