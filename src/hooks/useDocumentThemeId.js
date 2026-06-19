"use client";

import { ACTIVE_THEME_ID } from "@/theme";

/** Active theme id — site is dark-only; no runtime switching. */
export function useDocumentThemeId() {
  return ACTIVE_THEME_ID;
}
