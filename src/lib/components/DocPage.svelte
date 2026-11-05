<script lang="ts">
  /**
   * The frame the about and privacy pages share. Unlike the Scene these are
   * ordinary scrolling pages, so here a footer really can sit at the bottom.
   * The page itself never scrolls (the Scene must not), so this frame does.
   */

  import { asset, resolve } from "$app/paths";
  import LanguagePicker from "$lib/components/LanguagePicker.svelte";
  import { t } from "$lib/i18n/index.svelte";
  import logoUrl from "$lib/brand/logo.svg";
  import type { Snippet } from "svelte";

  let {
    title,
    lede,
    children,
  }: { title: string; lede: string; children: Snippet } = $props();
</script>

<div
  class="fixed inset-0 flex flex-col overflow-y-auto bg-gradient-to-b from-amber-50 to-orange-100 text-slate-900"
>
  <header class="border-b border-amber-200/70 bg-white/70 backdrop-blur-md">
    <div
      class="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3"
    >
      <a
        href={resolve("/")}
        class="flex items-center gap-2 text-lg font-semibold tracking-tight hover:text-slate-600"
      >
        <img src={logoUrl} alt="" class="size-9" />
        FlüsterWelt
      </a>
      <div class="flex items-center gap-2">
        <a
          href={resolve("/")}
          class="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >{t("common.back")}</a
        >
        <LanguagePicker />
      </div>
    </div>
  </header>

  <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
    <h1 class="mb-2 text-3xl font-semibold tracking-tight">{title}</h1>
    <p class="mb-8 text-slate-600">{lede}</p>
    {@render children()}
  </main>

  <footer
    class="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 pb-6 text-center text-sm text-slate-600"
  >
    <a
      href="https://teacher.dev"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-2 hover:text-slate-900"
    >
      <img src={asset("/edtechathon-logo.svg")} alt="" class="size-6" />
      {t("common.builtBy")}
    </a>
    <a href={resolve("/#how-it-works")} class="hover:text-slate-900"
      >{t("common.howItWorks")}</a
    >
    <a href={resolve("/about")} class="hover:text-slate-900"
      >{t("common.about")}</a
    >
    <a href={resolve("/privacy")} class="hover:text-slate-900"
      >{t("common.privacy")}</a
    >
  </footer>
</div>
