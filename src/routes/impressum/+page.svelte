<script lang="ts">
  import DocPage from "$lib/components/DocPage.svelte";
  import PageMeta from "$lib/components/PageMeta.svelte";
</script>

<PageMeta
  path="/impressum"
  title="Impressum – FlüsterWelt"
  description="Anbieterkennzeichnung und Open-Source-Herkunft der FlüsterWelt-Website."
/>

<DocPage
  title="Impressum"
  lede="Anbieterkennzeichnung für das privat betriebene Projekt FlüsterWelt"
>
  <section
    class="mb-6 space-y-4 rounded-2xl bg-white/95 p-6 leading-relaxed text-slate-700 shadow-lg"
  >
    <h2 class="text-xl font-semibold text-slate-900">
      Angaben gemäß § 18 Abs. 1 MStV
    </h2>
    <p><strong>Daniel Menges</strong></p>
    <p>Wolzenstr. 21<br />14712 Rathenow<br />Deutschland</p>
    <p>
      E-Mail: <a
        class="font-semibold text-teal-700 underline"
        href="mailto:duplex.klirrt.2d@icloud.com">duplex.klirrt.2d@icloud.com</a
      >
    </p>
  </section>

  <section
    class="mb-6 space-y-3 rounded-2xl bg-white/95 p-6 leading-relaxed text-slate-700 shadow-lg"
  >
    <h2 class="text-xl font-semibold text-slate-900">
      Projekt und Open-Source-Herkunft
    </h2>
    <p>
      FlüsterWelt ist eine privat betriebene, unabhängige deutschsprachige
      Weiterentwicklung von
      <a
        class="font-semibold text-teal-700 underline"
        href="https://github.com/teacherdotdev/shy-safari"
        target="_blank"
        rel="noopener noreferrer">Shy Safari</a
      >
      von teacher.dev. FlüsterWelt wird unabhängig von teacher.dev betrieben. Der
      Quellcode steht unter der Apache License 2.0.
    </p>
    <p>
      Den Quellcode und die Möglichkeit, technische Probleme zu melden, findest
      du im
      <a
        class="font-semibold text-teal-700 underline"
        href="https://github.com/Manantra/fluesterwelt"
        target="_blank"
        rel="noopener noreferrer">FlüsterWelt-Repository auf GitHub</a
      >.
    </p>
  </section>
</DocPage>
