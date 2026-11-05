<script lang="ts">
  import { resolve } from "$app/paths";
  import DocPage from "$lib/components/DocPage.svelte";
  import PageMeta from "$lib/components/PageMeta.svelte";

  const card = "mb-6 rounded-2xl bg-white/95 p-6 shadow-lg shadow-amber-900/5";
  const heading = "mb-3 text-xl font-semibold text-slate-900";
  const text = "space-y-3 leading-relaxed text-slate-700";
  const link = "font-medium text-teal-700 underline underline-offset-2";
</script>

<PageMeta
  path="/privacy"
  title="Datenschutz – FlüsterWelt"
  description="Hinweise zu Mikrofon, Browser-Speicher, Hosting und Datenschutz bei FlüsterWelt."
/>

<DocPage
  title="Datenschutz"
  lede="So geht FlüsterWelt mit Mikrofonzugriff, lokal gespeicherten Einstellungen und technischen Verbindungsdaten um."
>
  <aside
    class="mb-6 rounded-xl border border-amber-400 bg-amber-100 p-4 text-amber-950"
  >
    <strong>Wichtig vor der Veröffentlichung:</strong>
    Diese Erklärung ist ein Entwurf für die eigenständig betriebene FlüsterWelt-Website.
    Angaben zur verantwortlichen Person, zum Hosting, zu Protokollierungsfristen und
    zu Kontaktmöglichkeiten müssen vor dem öffentlichen Start ergänzt und mit dem
    tatsächlichen Betrieb abgeglichen werden.
  </aside>

  <section class={card}>
    <h2 class={heading}>1. Verantwortliche Stelle</h2>
    <div class={text}>
      <p>
        <strong>[Name oder Organisation des Websitebetreibers eintragen]</strong
        >
      </p>
      <p>[Ladungsfähige Anschrift eintragen]</p>
      <p>E-Mail: <strong>[Datenschutz-Kontaktadresse eintragen]</strong></p>
      <p>
        Weitere Anbieterangaben findest du im <a
          class={link}
          href={resolve("/impressum")}>Impressum</a
        >.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>2. Nutzung des Mikrofons</h2>
    <div class={text}>
      <p>
        FlüsterWelt fragt erst nach einem Klick auf „Starten“ nach der
        Mikrofonfreigabe. Die App misst die Lautstärke direkt im Browser, um
        Tiere und andere Entdeckungen entsprechend der Raumlautstärke erscheinen
        zu lassen.
      </p>
      <p>
        <strong>Die Anwendung fertigt keine Tonaufnahmen an.</strong> Der Mikrofonton
        wird weder auf einem Server gespeichert noch von der FlüsterWelt-Anwendung
        an einen Server übertragen. Nur die daraus lokal berechnete Lautstärke wird
        für die Anzeige verwendet.
      </p>
      <p>
        Du kannst die Freigabe in den Einstellungen deines Browsers jederzeit
        entziehen. Ohne Mikrofon kann die Lautstärkefunktion nicht genutzt
        werden.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>3. Speicherung im Browser</h2>
    <div class={text}>
      <p>
        Die Anwendung speichert auf deinem Gerät über den lokalen
        Browserspeicher unter anderem Einstellungen, die Kalibrierung,
        Klassenbezeichnungen, entdeckte Tiere, Szenenfortschritte und
        gegebenenfalls Notizen. Diese Angaben werden nicht durch die Anwendung
        mit einem Onlinekonto synchronisiert.
      </p>
      <p>
        Du kannst die Daten entfernen, indem du die Website-Daten im Browser
        löschst. Die Speicherung dient den von dir verwendeten Funktionen und
        dem Wiederherstellen deiner Einstellungen.
      </p>
      <p>
        Die Endgerätespeicherung ist zusätzlich nach § 25 TDDDG zu beurteilen.
        Ob für einzelne optionale Speicherfunktionen eine Einwilligung notwendig
        ist, muss vor dem Livegang anhand der endgültigen Funktionen überprüft
        werden.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>4. Hosting und Serverprotokolle</h2>
    <div class={text}>
      <p>
        Damit die Website geladen werden kann, werden technisch bedingt
        Verbindungsdaten an den späteren Hostinganbieter übermittelt, darunter
        typischerweise IP-Adresse, Zeitpunkt, abgerufene Dateien und
        Informationen zum Browser. Auch wenn FlüsterWelt selbst kein Backend
        betreibt, kann der Webserver Protokolldaten speichern.
      </p>
      <p>
        <strong>Hoster:</strong> [Hostingunternehmen und Standort eintragen]
      </p>
      <p>
        <strong>Protokolldaten und Speicherdauer:</strong> [Art und Löschfrist anhand
        der tatsächlichen Hosterkonfiguration eintragen]
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> [passende Rechtsgrundlage für den jeweiligen
        Betreiber eintragen; z. B. Art. 6 Abs. 1 lit. f DSGVO bei privaten Betreibern
        oder ggf. lit. e bei öffentlichen Stellen].
      </p>
      <p>
        <strong>Auftragsverarbeitung / Drittlandtransfer:</strong> [Hostingvertrag,
        eingesetzte Dienstleister und etwaige Übermittlungen prüfen und ergänzen].
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>5. Cookies, Analyse und externe Links</h2>
    <div class={text}>
      <p>
        Im FlüsterWelt-Quellcode ist derzeit kein Webanalyse- oder Werbetracking
        aktiviert. Die ursprüngliche Cloudflare-Webanalyse von Shy Safari wurde
        aus diesem Fork entfernt. Die Anwendung selbst setzt keine
        Tracking-Cookies.
      </p>
      <p>
        Links zu externen Websites wie GitHub oder teacher.dev führen zu anderen
        Anbietern. Deren Datenverarbeitung richtet sich nach den jeweiligen
        Datenschutzhinweisen. Ob der spätere Hostinganbieter zusätzlich
        technische Dienste einsetzt, ist vor dem Livegang zu prüfen.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>6. Deine Rechte</h2>
    <div class={text}>
      <p>
        Nach Maßgabe der DSGVO können dir insbesondere Rechte auf Auskunft,
        Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch zustehen. Eine erteilte
        Einwilligung kannst du grundsätzlich mit Wirkung für die Zukunft
        widerrufen.
      </p>
      <p>
        Du kannst dich zudem bei einer zuständigen Datenschutzaufsichtsbehörde
        beschweren. Für Anfragen nutze bitte die oben anzugebende
        Datenschutz-Kontaktadresse.
      </p>
      <p>
        Die Details hängen davon ab, welche personenbezogenen Daten beim
        tatsächlichen Hosting verarbeitet werden.
      </p>
    </div>
  </section>

  <p class="mb-6 text-center text-sm text-slate-600">
    Stand: November 2026. Vor Veröffentlichung abschließend prüfen.
  </p>
</DocPage>
