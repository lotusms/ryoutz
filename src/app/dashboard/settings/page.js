"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardSettingsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/products");
  }, [router]);
  return (
    <p className="text-sm text-slate-400">Redirecting to Products…</p>
  );
}
