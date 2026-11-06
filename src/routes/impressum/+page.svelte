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
  <aside
    class="mb-6 rounded-xl border border-amber-400 bg-amber-100 p-4 text-amber-950"
  >
    <strong>Vor der Veröffentlichung rechtlich prüfen:</strong>
    Die Angaben zur privat verantwortlichen Person sind eingetragen. Ob zusätzliche
    Anbieterpflichten nach § 18 MStV oder § 5 DDG bestehen, muss anhand des konkreten
    Angebots geprüft werden. Die Datenschutzerklärung ist ebenfalls noch nicht abschließend.
  </aside>

  <section
    class="mb-6 space-y-4 rounded-2xl bg-white/95 p-6 leading-relaxed text-slate-700 shadow-lg"
  >
    <h2 class="text-xl font-semibold text-slate-900">Angaben zum Anbieter</h2>
    <p><strong>Daniel Menges</strong></p>
    <p>Wolzenstr. 21<br />14712 Rathenow<br />Deutschland</p>
    <p>
      E-Mail: <a
        class="font-semibold text-teal-700 underline"
        href="mailto:duplex.klirrt.2d@icloud.com">duplex.klirrt.2d@icloud.com</a
      >
    </p>
    <p>
      [Falls einschlägig: Rechtsform, vertretungsberechtigte Person, Register
      und Registernummer, Umsatzsteuer-ID, zuständige Aufsichtsbehörde und
      weitere Pflichtangaben ergänzen.]
    </p>
    <p>
      [Prüfen, ob bei journalistisch-redaktionellen Inhalten eine
      verantwortliche Person gemäß § 18 Abs. 2 MStV anzugeben ist.]
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
