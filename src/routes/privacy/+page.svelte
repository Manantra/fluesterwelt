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
  description="Datenschutzhinweise zum Mikrofon, zur lokalen Speicherung und zum Hosting über Cloudflare Pages."
/>

<DocPage
  title="Datenschutz"
  lede="Informationen dazu, welche Daten bei der Nutzung von FlüsterWelt verarbeitet werden."
>
  <aside
    class="mb-6 rounded-xl border border-amber-400 bg-amber-100 p-4 text-amber-950"
  >
    <strong>Diese Erklärung ist noch nicht abschließend.</strong>
    Vor der öffentlichen Freigabe fehlen die Betreiber- und Kontaktangaben
    sowie eine Prüfung der Cloudflare-Vertragsbedingungen,
    Datenübermittlungen und Aufbewahrungsfristen. Bitte die noch offenen
    Angaben nicht durch Vermutungen ersetzen.
  </aside>

  <section class={card}>
    <h2 class={heading}>1. Verantwortliche Person</h2>
    <div class={text}>
      <p><strong>[Vor- und Nachname oder Organisation]</strong></p>
      <p>[Straße und Hausnummer, PLZ und Ort]</p>
      <p>E-Mail: <strong>[Datenschutz-Kontaktadresse]</strong></p>
      <p>
        Weitere Angaben findest du im
        <a class={link} href={resolve("/impressum")}>Impressum</a>.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>2. Aufruf der Website und Cloudflare Pages</h2>
    <div class={text}>
      <p>
        FlüsterWelt wird als statische Website über
        <strong>Cloudflare Pages</strong> bereitgestellt. Die Inhalte werden
        über die Infrastruktur von Cloudflare ausgeliefert. Ein eigener
        Anwendungsserver mit Nutzerkonten oder einer Nutzerdatenbank wird für
        FlüsterWelt nicht betrieben.
      </p>
      <p>
        Beim Aufruf der Website werden technisch notwendige Verbindungsdaten
        verarbeitet. Dazu können insbesondere die IP-Adresse, Datum und
        Uhrzeit, die angefragte Adresse, Informationen zum verwendeten Browser
        und technische Status- bzw. Sicherheitsinformationen gehören.
        Diese Verarbeitung dient der Übertragung der Website und dem Schutz
        der bereitstellenden Infrastruktur.
      </p>
      <p>
        <strong>Hostingdienst:</strong> Cloudflare Pages, angeboten durch
        Cloudflare, Inc. und gegebenenfalls verbundene Gesellschaften.
        Welcher Vertragspartner für das Betreiberkonto gilt, muss anhand
        der Vertragsunterlagen geprüft werden.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Bei eigenverantwortlichem privatem
        Betrieb kommt für die technische Bereitstellung und Absicherung
        insbesondere Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
        an einem sicheren und funktionierenden Webangebot) in Betracht.
        [Betreiberstatus und Rechtsgrundlage verbindlich prüfen.]
      </p>
      <p>
        <strong>Speicherdauer:</strong>
        [Konkrete Cloudflare-Protokollierungs- und Löschfristen anhand des
        genutzten Tarifs und der aktivierten Funktionen prüfen und ergänzen.]
      </p>
      <p>
        <strong>Auftragsverarbeitung und Drittlandübermittlungen:</strong>
        Cloudflare betreibt eine international verteilte Infrastruktur;
        Übermittlungen außerhalb des EWR können nicht pauschal ausgeschlossen
        werden. [Cloudflare-Vertrag, Auftragsverarbeitungsvereinbarung,
        eingesetzte Empfänger und Übermittlungsgrundlagen prüfen und konkret
        benennen.]
        Weitere Informationen bietet
        <a
          class={link}
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer">Cloudflare</a
        >.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>3. Mikrofon und Lautstärkemessung</h2>
    <div class={text}>
      <p>
        Der Browser fragt nach einer Mikrofonfreigabe, wenn du FlüsterWelt
        startest. Die Anwendung wertet den Mikrofoneingang direkt auf deinem
        Gerät aus und berechnet daraus einen Lautstärkewert, mit dem die
        dargestellten Szenen gesteuert werden.
      </p>
      <p>
        <strong>FlüsterWelt nimmt keine Gespräche auf.</strong>
        Der Mikrofonton wird von der Anwendung weder gespeichert noch
        an Cloudflare oder andere Server übertragen. Es werden keine
        Sprachaufzeichnungen oder Transkripte angelegt.
      </p>
      <p>
        Du kannst die Mikrofonberechtigung jederzeit in deinem Browser
        entziehen. Ohne Freigabe ist die Lautstärkemessung nicht nutzbar.
        Die Auswahl eines Mikrofons sowie Kalibrierungswerte können lokal
        auf deinem Gerät gespeichert werden.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>4. Lokale Speicherung auf deinem Gerät</h2>
    <div class={text}>
      <p>
        FlüsterWelt verwendet den lokalen Browserspeicher
        (<code>localStorage</code>), damit Einstellungen nach dem Schließen
        der Seite erhalten bleiben. Dazu gehören unter anderem:
        Sprache, Lautstärke- und Mikrofoneinstellungen,
        Kalibrierung, Klassenbezeichnungen, entdeckte Tiere und
        Szenenfortschritte, Timer-Einstellungen sowie selbst eingegebene
        Notiztexte und Zeichnungen.
      </p>
      <p>
        Diese Inhalte werden durch die Anwendung nicht auf einen
        FlüsterWelt-Server hochgeladen und nicht mit einem Benutzerkonto
        synchronisiert. Sie verbleiben grundsätzlich auf dem jeweiligen
        Gerät und im jeweiligen Browser, bis du sie in der Anwendung
        zurücksetzt oder die Website-Daten im Browser löschst.
      </p>
      <p>
        <strong>Hinweis für Schulen:</strong>
        Bitte verwende in Klassenbezeichnungen und Notizen möglichst
        keine personenbezogenen Daten von Schülerinnen und Schülern,
        insbesondere nicht auf gemeinsam genutzten Geräten.
      </p>
      <p>
        Für das Speichern und Auslesen von Informationen auf Endgeräten
        ist § 25 TDDDG relevant. Eine Einwilligung ist unter anderem
        dann nicht erforderlich, wenn die Speicherung für den ausdrücklich
        gewünschten Dienst unbedingt notwendig ist.
        [Prüfen, ob dies auf alle angebotenen Speicherfunktionen zutrifft
        oder einzelne Funktionen eine gesonderte Einwilligung erfordern.]
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>5. Cookies und Reichweitenmessung</h2>
    <div class={text}>
      <p>
        Der FlüsterWelt-Anwendungscode setzt keine Werbe- oder
        Tracking-Cookies und enthält kein eigenes Analyse-Skript.
        Die im ursprünglichen Shy-Safari-Projekt verwendete
        Cloudflare-Webanalyse wurde aus diesem Fork entfernt.
      </p>
      <p>
        Cloudflare kann abhängig von der aktivierten Sicherheitskonfiguration
        eigene technisch erforderliche Mechanismen einsetzen.
        [Im Cloudflare-Dashboard prüfen, ob Web Analytics,
        weitere Sicherheitsfunktionen oder zusätzliche Cookies aktiviert sind;
        diese Erklärung gegebenenfalls anpassen.]
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>6. Externe Links</h2>
    <div class={text}>
      <p>
        FlüsterWelt enthält Links zu externen Websites wie GitHub
        und teacher.dev. Erst wenn du diese Links öffnest, rufst du
        die jeweilige fremde Website auf. Dort gelten die
        Datenschutzinformationen des jeweiligen Anbieters.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>7. Deine Datenschutzrechte</h2>
    <div class={text}>
      <p>
        Soweit die jeweiligen gesetzlichen Voraussetzungen vorliegen,
        hast du Rechte auf Auskunft, Berichtigung, Löschung,
        Einschränkung der Verarbeitung, Datenübertragbarkeit
        und Widerspruch. Eine auf Einwilligung gestützte Verarbeitung
        kannst du grundsätzlich mit Wirkung für die Zukunft widerrufen.
      </p>
      <p>
        Du kannst dich bei einer Datenschutzaufsichtsbehörde
        beschweren. Wende dich bei Fragen oder zur Ausübung deiner
        Rechte an die unter Abschnitt 1 genannte Kontaktadresse.
      </p>
      <p>
        Eine automatisierte Entscheidungsfindung einschließlich
        Profiling findet durch die FlüsterWelt-Anwendung nicht statt.
      </p>
    </div>
  </section>

  <p class="mb-6 text-center text-sm text-slate-600">
    Stand: November 2026. Entwurf – vor Veröffentlichung prüfen und vervollständigen.
  </p>
</DocPage>
