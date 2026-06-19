"use client";

import Link from "next/link";
import { useMemo } from "react";
import { RiArrowRightLine, RiMailLine, RiShoppingBag3Line } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

export default function AccountHomePage() {
  const { user, userAccount } = useAuth();

  const greeting = useMemo(() => {
    if (userAccount.status !== "ready") return "Welcome";
    const first = String(userAccount.firstName ?? "").trim();
    if (first) return `Welcome back, ${first}`;
    const dn = String(user?.displayName ?? "").trim();
    if (dn) return `Welcome back, ${dn.split(/\s+/)[0]}`;
    return "Welcome back";
  }, [userAccount, user?.displayName]);

  const email = user?.email ?? "";

  return (
    <div className="relative mx-auto max-w-4xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-40 h-64 w-64 rounded-full bg-sky-500/10 blur-[90px]"
      />

      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-blue-400/90">
          My Account
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium tracking-[-0.04em] text-amber-50 sm:text-5xl">
          {greeting}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-amber-400">
          Your collector account is where orders, receipts, and studio updates come
          together—quietly, without the noise of a generic storefront.
        </p>

        {email ? (
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-amber-300 backdrop-blur-sm">
            <RiMailLine className="h-4 w-4 shrink-0 text-blue-400/80" aria-hidden />
            <span className="truncate">{email}</span>
          </div>
        ) : null}
      </div>

      <div className="relative mt-14 grid gap-5 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-amber-900/90 to-amber-950/95 p-8 shadow-xl shadow-amber-950/40 ring-1 ring-white/5 transition hover:border-blue-400/35 hover:ring-blue-400/25"
        >
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl transition group-hover:bg-blue-400/18"
          />
          <RiShoppingBag3Line
            className="relative h-10 w-10 text-blue-200/90"
            aria-hidden
          />
          <h2 className="relative mt-6 font-serif text-2xl font-medium tracking-[-0.02em] text-amber-100">
            My orders
          </h2>
          <p className="relative mt-2 text-sm leading-relaxed text-amber-500">
            Track purchases, open details, and search past shipments.
          </p>
          <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-200/95">
            View orders
            <RiArrowRightLine className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/gallery"
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-amber-900/80 to-amber-950/90 p-8 shadow-xl shadow-amber-950/40 ring-1 ring-white/5 transition hover:border-sky-400/25 hover:ring-sky-400/15"
        >
          <div
            aria-hidden
            className="absolute -right-6 bottom-0 h-px w-48 bg-linear-to-r from-transparent via-blue-400/40 to-transparent opacity-60"
          />
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
            Browse
          </p>
          <h2 className="mt-4 font-serif text-2xl font-medium tracking-[-0.02em] text-amber-100">
            Gallery
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-500">
            Browse sessions, commissions, and portfolio highlights.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
            View gallery
            <RiArrowRightLine className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <p className="relative mt-12 text-center text-sm text-slate-600">
        Need help?{" "}
        <Link
          href="/contact"
          className="font-medium text-blue-200/90 underline decoration-blue-400/30 underline-offset-4 transition hover:text-blue-100"
        >
          Contact the studio
        </Link>
      </p>
    </div>
  );
}
