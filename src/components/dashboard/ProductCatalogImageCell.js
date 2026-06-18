"use client";

import { useRef, useState } from "react";
import { getFirebaseAuth } from "@firebase/client";

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * @param {{
 *   slug: string;
 *   patchProductSettings: (slug: string, patch: Record<string, unknown>) => Promise<void>;
 * }} props
 */
export default function ProductCatalogImageCell({ slug, patchProductSettings }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const btnSecondary =
    "rounded-full border border-slate-500/60 bg-slate-900/40 px-4 py-1.5 text-xs font-semibold text-stone-100 transition hover:border-amber-300/45 disabled:opacity-50";

  const btnPrimary =
    "rounded-full bg-linear-to-br from-amber-100 via-stone-100 to-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-900 disabled:opacity-50";

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !slug) return;
    if (!file.type.startsWith("image/")) {
      setMsg("Choose an image file (PNG, JPG, WebP, etc.).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setMsg("Max file size is 8 MB.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (!user) {
        setMsg("Sign in to upload.");
        return;
      }
      const token = await user.getIdToken();
      const form = new FormData();
      form.set("slug", slug);
      form.set("file", file);
      const res = await fetch("/api/dashboard/catalog-product-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || typeof data.url !== "string") {
        setMsg(typeof data.error === "string" ? data.error : "Upload failed.");
        return;
      }
      await patchProductSettings(slug, { customImageUrl: data.url });
      setMsg("Saved to product.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={`Upload image for ${slug}`}
        onChange={onFileChange}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className={btnPrimary}
        >
          {busy ? "Uploading…" : "Choose image…"}
        </button>
        <button
          type="button"
          disabled={busy}
          className={btnSecondary}
          onClick={async () => {
            setBusy(true);
            setMsg("");
            try {
              await patchProductSettings(slug, { customImageUrl: "" });
              setMsg("Using Printful image again.");
            } catch (err) {
              setMsg(err instanceof Error ? err.message : "Could not clear.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Use Printful
        </button>
      </div>
      {msg ? (
        <p
          className={`text-xs ${msg.includes("fail") || msg.includes("Choose") || msg.includes("Max") || msg.includes("Sign") || msg.includes("Forbidden") || msg.includes("Invalid") ? "text-amber-200/90" : "text-slate-500"}`}
        >
          {msg}
        </p>
      ) : null}
    </div>
  );
}
