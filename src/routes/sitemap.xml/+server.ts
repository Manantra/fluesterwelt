import { PAGES, SITE_URL, absoluteUrl } from "$lib/site";

// Written out once at build time, like every other page.
export const prerender = true;

export function GET() {
  const urls = (SITE_URL ? PAGES : [])
    .map((path) => `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n  </url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
