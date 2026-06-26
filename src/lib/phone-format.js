/** Strip a tel field to up to 10 US digits (drops leading country code 1). */
export function digitsFromTelInput(value) {
  let d = String(value).replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.slice(0, 10);
}

/** Format up to 10 digits as (###) ###-#### while typing. */
export function formatUsPhoneMask(digits) {
  const d = String(digits).replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 3) return `(${d}`;
  if (d.length === 3) return `(${d})`;
  if (d.length <= 6) {
    return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  }
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
