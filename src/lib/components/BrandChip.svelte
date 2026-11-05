<script lang="ts">
  /**
   * The footer, folded into a corner.
   *
   * The Scene fills the whole screen, so there is no strip of page left to
   * stand a footer in. Instead the teacher.dev mark sits in the top bar and
   * opens what a footer would have said: who built this, and the about and
   * privacy pages. How it works has its own button in the bottom corner.
   */

  import { resolve } from "$app/paths";
  import logoUrl from "$lib/brand/logo.svg";
  import { t } from "$lib/i18n/index.svelte";

  /** Pointing at it is enough on a desktop; nothing has to be clicked. */
  let hovering = $state(false);
  /** Anything inside has keyboard focus, so tabbing through opens it too. */
  let focused = $state(false);
  /** Left open by a click, which is what a touch screen has instead of a hover. */
  let pinned = $state(false);

  const open = $derived(hovering || focused || pinned);
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") pinned = false;
  }}
/>

<div
  role="presentation"
  class="relative"
  onpointerenter={() => (hovering = true)}
  onpointerleave={() => (hovering = false)}
  onfocusin={() => (focused = true)}
  onfocusout={() => {
    focused = false;
    pinned = false;
  }}
>
  <button
    type="button"
    class="grid size-11 cursor-pointer place-items-center rounded-full bg-white/95 shadow-lg transition hover:bg-white"
    aria-expanded={open}
    aria-controls="brand-panel"
    aria-label={t("brand.title")}
    title={t("brand.title")}
    onclick={() => (pinned = !pinned)}
  >
    <img src={logoUrl} alt="" class="size-9" />
  </button>

  <!-- Always in the document, so the button keeps something to point its
       aria-controls at and the links stay reachable by keyboard; only laid
       out on screen once it is asked for. The gap under the chip is padding
       on this wrapper rather than a margin on the card, so the pointer never
       leaves the chip on its way down to the links. -->
  <div
    id="brand-panel"
    class={open ? "absolute top-full left-0 z-10 pt-2" : "sr-only"}
  >
    <div
      class="flex w-max flex-col items-start gap-1 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg"
    >
      <a
        href="https://github.com/Manantra/fluesterwelt"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm font-semibold text-slate-900 hover:underline"
        >FlüsterWelt auf GitHub</a
      >
      <p class="flex items-center gap-2 text-xs font-medium text-slate-600">
        <a href={resolve("/about")} class="hover:text-slate-900 hover:underline"
          >{t("common.about")}</a
        >
        <span aria-hidden="true" class="text-slate-300">·</span>
        <a
          href={resolve("/privacy")}
          class="hover:text-slate-900 hover:underline">{t("common.privacy")}</a
        >
        <span aria-hidden="true" class="text-slate-300">·</span>
        <a
          href={resolve("/impressum")}
          class="hover:text-slate-900 hover:underline">{t("common.imprint")}</a
        >
      </p>
    </div>
  </div>
</div>
