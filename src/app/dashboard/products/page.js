"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@firebase/client";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { CATALOG_PRODUCT_SETTINGS_COLLECTION } from "@/lib/catalog-merchandising-constants";
import {
  SHOP_CATEGORY_IDS,
  SHOP_CATEGORY_TAB_LABELS,
} from "@/lib/shopCategories";
import ProductCatalogImageCell from "@/components/dashboard/ProductCatalogImageCell";
import SelectListbox from "@/components/ui/SelectListbox";
import * as dash from "@/lib/dashboardChrome";
import * as overlayChrome from "@/lib/overlayChrome";
import { isLightThemeId } from "@/theme";

/** SelectListbox option value when Firestore has no `shopCategory` (empty string is treated as “no selection” by SelectListbox). */
const CATEGORY_LISTBOX_UNASSIGNED = "__unassigned__";

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="size-4 rounded border-slate-500 accent-amber-400 disabled:opacity-40"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={disabled ? "text-slate-500" : ""}>{label}</span>
    </label>
  );
}

export default function DashboardProductsPage() {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [settingsBySlug, setSettingsBySlug] = useState(() => new Map());

  useEffect(() => {
    const db = getFirebaseDb();
    const unsubSettings = onSnapshot(
      collection(db, CATALOG_PRODUCT_SETTINGS_COLLECTION),
      (snap) => {
        const next = new Map();
        snap.forEach((d) => next.set(d.id, d.data() || {}));
        setSettingsBySlug(next);
      },
      (err) => console.error("[products] settings", err),
    );

    return () => {
      unsubSettings();
    };
  }, []);

  const loadGalleryCatalog = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("Not signed in.");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("/api/dashboard/catalog-products", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not load products.");
        return;
      }
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGalleryCatalog();
  }, [loadGalleryCatalog]);

  const rows = useMemo(() => {
    return [...products].sort((a, b) =>
      String(a.title || "").localeCompare(String(b.title || ""), undefined, {
        sensitivity: "base",
      }),
    );
  }, [products]);

  const categoryListboxOptions = useMemo(
    () => [
      { value: CATEGORY_LISTBOX_UNASSIGNED, label: "Unassigned" },
      ...SHOP_CATEGORY_IDS.map((id) => ({
        value: id,
        label: SHOP_CATEGORY_TAB_LABELS[id],
      })),
    ],
    [],
  );

  const patchProductSettings = async (slug, patch) => {
    const db = getFirebaseDb();
    await setDoc(
      doc(db, CATALOG_PRODUCT_SETTINGS_COLLECTION, slug),
      { ...patch, updatedAt: serverTimestamp() },
      { merge: true },
    );
  };

  const settingFor = (slug) => settingsBySlug.get(slug) || {};

  const tableWrap = light
    ? "overflow-x-auto rounded-2xl border border-stone-300/60 bg-white/90 shadow-sm"
    : "overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-900/40 shadow-lg shadow-slate-950/30";

  const th = light
    ? "px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-stone-600"
    : "px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400";

  const td = light ? "px-3 py-3 align-middle text-sm text-stone-800" : "px-3 py-3 align-middle text-sm text-stone-200";

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className={dash.dashboardPageTitle(light)}>Products</h1>
      <p className="mt-3 text-sm">
        Control visibility, which pieces appear in the home hero slider and home collection (only
        checked items show there), optional custom listing images, and gallery section filters
        (Mens, Womens, or Accessories). Pieces are loaded from{" "}
        <code className="rounded bg-slate-800/80 px-1 py-0.5 text-xs text-stone-200">
          public/images/gallery
        </code>
        ; per-piece toggles are stored in Firestore by slug.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-400">{error}</p>
      ) : null}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => void loadGalleryCatalog()}
          className="rounded-full border border-slate-500/60 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:border-amber-300/45"
        >
          Refresh gallery list
        </button>
      </div>

      {loading ? (
        <p className={`mt-10 text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>Loading…</p>
      ) : (
        <div className={`mt-8 ${tableWrap}`}>
          <table className="min-w-[64rem] w-full border-collapse text-left">
            <thead>
              <tr className={light ? "border-b border-stone-200" : "border-b border-slate-700/60"}>
                <th className={th}>Image</th>
                <th className={th}>Product</th>
                <th className={th}>Category</th>
                <th className={th}>Available</th>
                <th className={th}>Featured</th>
                <th className={th}>Home slider</th>
                <th className={th}>Product image</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const slug = String(p.slug || "");
                const s = settingFor(slug);
                const available = s.available !== false;
                const featured = s.featured === true;
                const onHomeSlider = s.onHomeSlider === true;
                const shopTabValue =
                  typeof s.shopCategory === "string" &&
                  SHOP_CATEGORY_IDS.includes(s.shopCategory.trim().toLowerCase())
                    ? s.shopCategory.trim().toLowerCase()
                    : "";
                const displayImage =
                  (typeof s.customImageUrl === "string" && s.customImageUrl.trim()) ||
                  p.image;

                return (
                  <tr
                    key={slug || p.id}
                    className={light ? "border-b border-stone-100" : "border-b border-slate-800/80"}
                  >
                    <td className={td}>
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-600/40 bg-slate-950/40">
                        {displayImage ? (
                          <Image
                            src={displayImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className={td}>
                      <p
                        className={`font-medium ${light ? "text-stone-900" : "text-stone-100"}`}
                      >
                        {p.title}
                      </p>
                      <p className={`text-xs ${light ? "text-stone-500" : "text-slate-500"}`}>
                        Slug: {slug}
                      </p>
                    </td>
                    <td className={`${td} min-w-[13rem]`}>
                      <div className="max-w-[14rem]">
                        <SelectListbox
                          showLabel={false}
                          placeholder="Unassigned"
                          options={categoryListboxOptions}
                          value={
                            shopTabValue ? shopTabValue : CATEGORY_LISTBOX_UNASSIGNED
                          }
                          onChange={async (v) => {
                            if (!v || v === CATEGORY_LISTBOX_UNASSIGNED) {
                              await patchProductSettings(slug, {
                                shopCategory: deleteField(),
                              });
                            } else {
                              await patchProductSettings(slug, { shopCategory: v });
                            }
                          }}
                          buttonClassName={`${overlayChrome.checkoutInputBase(light)} !mt-0 py-2.5`}
                        />
                      </div>
                    </td>
                    <td className={td}>
                      <Toggle
                        label="Visible"
                        checked={available}
                        onChange={async (v) => {
                          await patchProductSettings(slug, { available: v });
                        }}
                      />
                    </td>
                    <td className={td}>
                      <Toggle
                        label="Home collection"
                        checked={featured}
                        onChange={async (v) => {
                          await patchProductSettings(slug, { featured: v });
                        }}
                      />
                    </td>
                    <td className={td}>
                      <Toggle
                        label="Hero slider"
                        checked={onHomeSlider}
                        onChange={async (v) => {
                          await patchProductSettings(slug, { onHomeSlider: v });
                        }}
                      />
                    </td>
                    <td className={td}>
                      <ProductCatalogImageCell
                        slug={slug}
                        patchProductSettings={patchProductSettings}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
