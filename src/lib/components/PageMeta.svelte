<script lang="ts">
  // FlüsterWelt adaptation: localized social metadata.
  /**
   * The head tags every page needs so search engines, link previews and AI
   * assistants describe it properly: title, description, the one canonical
   * address, and optionally structured data about what the page is.
   */

  import { PREVIEW_IMAGE, absoluteUrl, type PagePath } from "$lib/site";
  import { current, t } from "$lib/i18n/index.svelte";

  let {
    path,
    title,
    description,
    jsonLd,
  }: {
    path: PagePath;
    title: string;
    description: string;
    jsonLd?: Record<string, unknown>;
  } = $props();

  const url = $derived(absoluteUrl(path));

  // `<` is escaped so no string in the data can close the script tag early.
  const structuredData = $derived(
    jsonLd &&
      `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</` +
        "script>",
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="FlüsterWelt" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:locale" content={current().locale} />
  <meta property="og:image" content={PREVIEW_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={t("preview.alt")} />
  <meta name="twitter:card" content="summary_large_image" />
  {#if structuredData}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- built from our own strings and escaped above -->
    {@html structuredData}
  {/if}
</svelte:head>
