function titleCaseWords(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

/**
 * Human-readable title from an image filename stem or full name.
 * `-` separates major parts joined with " & "; `_` is a space inside a part.
 * e.g. `elvis-clarissa_bekmanis.jpg` → `Elvis & Clarissa Bekmanis`
 * e.g. `elvis-bekmanis.jpg` → `Elvis & Bekmanis`
 *
 * @param {string} name — filename or path fragment
 */
export function displayTitleFromImageFilename(name) {
  const base = String(name || "").replace(/\.[^.]+$/, "");
  const dashParts = base
    .split("-")
    .map((p) => p.trim())
    .filter(Boolean);
  if (dashParts.length === 0) return base.trim();
  return dashParts
    .map((segment) => titleCaseWords(segment.replace(/_/g, " ")))
    .join(" & ");
}
