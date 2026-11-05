<script lang="ts">
  import "./layout.css";
  import { current, initializeLanguage } from "$lib/i18n/index.svelte";
  import { onMount } from "svelte";

  let { children } = $props();

  onMount(initializeLanguage);

  $effect(() => {
    document.documentElement.lang = current().locale;
  });
</script>

{@render children()}
