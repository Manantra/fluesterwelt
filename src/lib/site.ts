/**
 * FlüsterWelt canonical URLs are configured when we know the deployment host.
 * Until VITE_SITE_URL is supplied, don't accidentally advertise the original
 * Shy Safari website as our canonical URL.
 */
const configuredUrl = String(import.meta.env.VITE_SITE_URL ?? "").trim();

export const SITE_URL = /^https:\/\//i.test(configuredUrl)
  ? configuredUrl.replace(/\/+$/, "")
  : "";

export const PAGES = ["/", "/about", "/privacy", "/impressum"] as const;

export type PagePath = (typeof PAGES)[number];

export const PREVIEW_IMAGE = SITE_URL
  ? `${SITE_URL}/og-image.png`
  : "https://raw.githubusercontent.com/Manantra/fluesterwelt/main/static/og-image.png";

export function absoluteUrl(path: PagePath): string {
  return SITE_URL ? new URL(path, SITE_URL).href : path;
}
