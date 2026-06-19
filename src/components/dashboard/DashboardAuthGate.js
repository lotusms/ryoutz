"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as dash from "@/lib/dashboardChrome";
import * as overlayChrome from "@/lib/overlayChrome";
import { isLightThemeId } from "@/theme";

function GateEscapeBar() {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  return (
    <div className={dash.authGateBar(light)}>
      <Link href="/" className={dash.authGateLink(light)}>
        Home
      </Link>
      <Link href="/login" className={dash.authGateMutedLink(light)}>
        Sign in
      </Link>
    </div>
  );
}

export default function DashboardAuthGate({ children }) {
  const { user, loading, accountLoading, isAdmin, signingOut, firebaseEnabled } =
    useAuth();
  const router = useRouter();
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const muted = overlayChrome.pageMutedText(light);

  useEffect(() => {
    if (!firebaseEnabled) return;
    if (loading || accountLoading) return;
    if (!user && !signingOut) {
      router.replace("/login");
      return;
    }
    if (user && !isAdmin) {
      router.replace("/account");
    }
  }, [
    firebaseEnabled,
    user,
    loading,
    accountLoading,
    isAdmin,
    signingOut,
    router,
  ]);

  if (!firebaseEnabled) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh flex-col items-center justify-center gap-4 px-6 ${muted}`}>
          <p className="max-w-md text-center text-sm leading-relaxed">
            Administrator login requires Firebase configuration. Add{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-xs">NEXT_PUBLIC_FIREBASE_*</code>{" "}
            variables to <code className="rounded bg-white/10 px-1 py-0.5 text-xs">.env.local</code>{" "}
            and restart the dev server.
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-blue-200/95 underline-offset-4 hover:underline"
          >
            Back to site
          </Link>
        </div>
      </>
    );
  }

  if (loading || accountLoading) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh items-center justify-center ${muted}`}>
          <p className="text-sm tracking-wide">Loading…</p>
        </div>
      </>
    );
  }

  if (!user && signingOut) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh items-center justify-center ${muted}`}>
          <p className="text-sm tracking-wide">Signing out…</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh items-center justify-center ${muted}`}>
          <p className="text-sm tracking-wide">Redirecting to sign in…</p>
        </div>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh items-center justify-center ${muted}`}>
          <p className="text-sm tracking-wide">Opening your account…</p>
        </div>
      </>
    );
  }

  return children;
}
