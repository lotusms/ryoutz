import { Geist, Geist_Mono } from "next/font/google";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";
import { orgName } from "@/config";
import { ACTIVE_THEME_ID } from "@/theme";
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

export const metadata = {
  title: orgName,
  description:
    "R. Youtz Asphalt Maintenance — professional asphalt maintenance and sealcoating services.",
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
  manifest: "/favicon/site.webmanifest",
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
