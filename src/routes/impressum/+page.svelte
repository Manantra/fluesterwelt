<script lang="ts">
  import DocPage from "$lib/components/DocPage.svelte";
  import PageMeta from "$lib/components/PageMeta.svelte";
</script>

<PageMeta
  path="/impressum"
  title="Impressum – FlüsterWelt"
  description="Anbieterkennzeichnung und Projektinformationen zu FlüsterWelt."
/>

<DocPage title="Impressum" lede="Anbieterkennzeichnung für FlüsterWelt">
  <aside
    class="mb-6 rounded-xl border border-amber-400 bg-amber-100 p-4 text-amber-950"
  >
    <strong>Vor der Veröffentlichung ausfüllen:</strong>
    Dieses Impressum enthält noch Platzhalter. Ob und welche Angaben benötigt werden,
    richtet sich nach der konkreten Betreiber- und Nutzungsform.
  </aside>
  <section
    class="mb-6 space-y-4 rounded-2xl bg-white/95 p-6 leading-relaxed text-slate-700 shadow-lg"
  >
    <h2 class="text-xl font-semibold text-slate-900">Angaben zum Anbieter</h2>
    <p><strong>[Name oder Organisation]</strong></p>
    <p>
      [Ladungsfähige Anschrift mit Straße, Hausnummer, Postleitzahl und Ort]
    </p>
    <p>E-Mail: [Kontakt-E-Mail-Adresse]</p>
    <p>
      [Weitere gegebenenfalls gesetzlich erforderliche Angaben, z. B.
      Vertretungsberechtigte, Registerangaben, Aufsichtsbehörde,
      Umsatzsteuer-ID]
    </p>
  </section>
  <section
    class="mb-6 space-y-3 rounded-2xl bg-white/95 p-6 leading-relaxed text-slate-700 shadow-lg"
  >
    <h2 class="text-xl font-semibold text-slate-900">Open-Source-Herkunft</h2>
    <p>
      FlüsterWelt ist eine unabhängige deutschsprachige Weiterentwicklung von
      <a
        class="font-semibold text-teal-700 underline"
        href="https://github.com/teacherdotdev/shy-safari"
        target="_blank"
        rel="noopener noreferrer">Shy Safari</a
      >
      von teacher.dev. Der Quellcode steht unter der Apache License 2.0.
    </p>
    <p>
      Den Quellcode dieser Weiterentwicklung gibt es auf
      <a
        class="font-semibold text-teal-700 underline"
        href="https://github.com/Manantra/fluesterwelt"
        target="_blank"
        rel="noopener noreferrer">GitHub</a
      >.
    </p>
  </section>
</DocPage>
