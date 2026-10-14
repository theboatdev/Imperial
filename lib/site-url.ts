/**
 * Resolve the public site origin for OAuth redirects.
 * Always returns scheme + host only — never a locale path like `/en`.
 */
export function getSiteOrigin(requestUrl: string): string {
  let raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || new URL(requestUrl).origin;
  if (!raw.startsWith('http')) {
    raw = `https://${raw}`;
  }
  try {
    return new URL(raw).origin;
  } catch {
    return new URL(requestUrl).origin;
  }
}
