import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import CartProvider from "@/components/CartProvider";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";
import { AuthProvider } from "@/context/AuthContext";
import { orgName } from "@/config";
import { ACTIVE_THEME_ID } from "@/theme";
import "./globals.css";
import "@/theme/themes.css";

/** Display serif for bold, editorial brand headings */
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  // Avoid unused `<link rel="preload">` warnings when body text uses Geist first.
  preload: false,
});

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
    "RYoutz Asphalt Maintenance — professional asphalt maintenance and sealcoating services.",
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico", sizes: "any" },
      { url: "/images/favicon/favicon.svg", type: "image/svg+xml" },
      {
        url: "/images/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: "/images/favicon/apple-touch-icon.png",
  },
  manifest: "/images/favicon/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme={ACTIVE_THEME_ID}
      className={`${cormorant.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className="flex min-h-dvh flex-col overflow-x-clip bg-site-bg font-sans text-site-fg"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <ScrollToTopOnLoad />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
