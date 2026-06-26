export { applyCatalogMerchandising } from "@/lib/catalog-merchandising-apply";

/** Local gallery only — no Firestore merchandising flags. */
export async function loadCatalogMerchandisingState() {
  return {
    customMerchandising: false,
    bySlug: new Map(),
    adminSdkReachable: false,
  };
}
