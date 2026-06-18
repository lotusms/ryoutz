import Link from "next/link";

import RyoutzLogo from "@/components/brand/RyoutzLogo";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { orgName } from "@/config";

const footerLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  {
    href: "mailto:info@lotusmarketingsolutions.com",
    label: "Technical Support",
    external: true,
  },
];

const linkClass =
  "text-xs font-medium uppercase tracking-[0.28em] text-slate-500 transition hover:text-amber-200/90";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-white/10 bg-slate-950/80 py-8 backdrop-blur-md supports-backdrop-filter:bg-slate-950/70 sm:py-9">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 sm:px-10 lg:px-12">
        <Link
          href="/"
          className="group shrink-0 text-stone-100 transition-colors duration-300 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/60"
          aria-label={`${orgName} — home`}
        >
          <RyoutzLogo
            className="h-14 w-14 sm:h-16 sm:w-16"
            title={orgName}
          />
        </Link>

        <div className="flex flex-col items-end gap-4">
          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-end gap-x-6 gap-y-2 sm:gap-x-8"
          >
            {footerLinks.map((item) =>
              item.external ? (
                <a key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <SocialMediaLinks variant="footer" />
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-7xl px-6 text-center text-[0.65rem] uppercase tracking-[0.35em] text-slate-600 sm:px-10 lg:px-12">
        © {new Date().getFullYear()} {orgName}
      </p>
    </footer>
  );
}
