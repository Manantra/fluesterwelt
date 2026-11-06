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
    <strong>Diese Erklärung wird noch abschließend geprüft.</strong>
    Die Angaben zum privaten Betreiber und die öffentlich dokumentierte Cloudflare-Datenverarbeitung
    sind eingearbeitet. Offen sind noch der konkrete Vertragsstatus der Cloudflare-Auftragsverarbeitung
    sowie gegebenenfalls zusätzliche Sicherheitsfunktionen im Betreiberkonto. Produktabhängige
    Speicherfristen dürfen nicht mit einer pauschalen Löschfrist für alle Zugriffe
    verwechselt werden.
  </aside>

  <section class={card}>
    <h2 class={heading}>1. Verantwortliche Person (privater Betrieb)</h2>
    <div class={text}>
      <p>
        <strong>Daniel Menges</strong>
      </p>
      <p>Wolzenstr. 21, 14712 Rathenow, Deutschland</p>
      <p>
        E-Mail: <a class={link} href="mailto:duplex.klirrt.2d@icloud.com"
          >duplex.klirrt.2d@icloud.com</a
        >
      </p>
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
        <strong>Cloudflare Pages</strong> bereitgestellt. Die Inhalte werden über
        die Infrastruktur von Cloudflare ausgeliefert. Ein eigener Anwendungsserver
        mit Nutzerkonten oder einer Nutzerdatenbank wird für FlüsterWelt nicht betrieben.
      </p>
      <p>
        Beim Aufruf der Website werden technisch notwendige Verbindungsdaten
        verarbeitet. Dazu können insbesondere die IP-Adresse, Datum und Uhrzeit,
        die angefragte Adresse, Informationen zum verwendeten Browser und
        technische Status- bzw. Sicherheitsinformationen gehören. Diese
        Verarbeitung dient der Übertragung der Website und dem Schutz der
        bereitstellenden Infrastruktur.
      </p>
      <p>
        <strong>Hostingdienst:</strong> Cloudflare Pages, ein Dienst von
        Cloudflare. Nach dem veröffentlichten
        <a
          class={link}
          href="https://www.cloudflare.com/cloudflare-customer-dpa/"
          target="_blank"
          rel="noopener noreferrer">Cloudflare Data Processing Addendum (DPA)</a
        >
        ist Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, USA, die
        dort bezeichnete Auftragsverarbeiterin. An der Leistungserbringung können
        weitere Gesellschaften und Unterauftragnehmer beteiligt sein. Welcher Vertragspartner
        für dieses Betreiberkonto tatsächlich gilt, richtet sich nach den dort vereinbarten
        Bedingungen.
      </p>
      <p>
        <strong>Zweck und Rechtsgrundlage:</strong>
        Die Verarbeitung dient der sicheren, zuverlässigen Auslieferung der Website,
        der Abwehr technischer Angriffe und der Fehleranalyse. Für den privaten Betreiber
        besteht daran ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f
        DSGVO.
      </p>
      <p>
        <strong>Aufbewahrung:</strong>
        Die FlüsterWelt-Anwendung betreibt keine eigene Datenbank mit Besucherprotokollen.
        Cloudflare kann jedoch technische Verbindungs- und Sicherheitsdaten verarbeiten
        und abhängig von Datenart, Dienst und Konfiguration unterschiedlich lange
        aufbewahren. Cloudflare nennt in seiner
        <a
          class={link}
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer">Datenschutzerklärung</a
        >
        insbesondere den jeweiligen Verarbeitungszweck und gesetzliche Pflichten als
        Kriterien. Im DPA wird die für die Leistungserbringung notwendige Dauer als
        Maßstab beschrieben. Eine für sämtliche Besucherprotokolle einheitliche, verlässlich
        bestätigte Löschfrist liegt für dieses Pages-Projekt nicht vor. Aufbewahrungszeiten
        einzelner Analytics-Datensätze sind damit nicht gleichzusetzen.
      </p>
      <p>
        <strong>Auftragsverarbeitung:</strong>
        Cloudflare veröffentlicht ein
        <a
          class={link}
          href="https://www.cloudflare.com/cloudflare-customer-dpa/"
          target="_blank"
          rel="noopener noreferrer"
          >Data Processing Addendum, Version 6.4 vom 3. April 2026</a
        >, das unter anderem Pflichten von Cloudflare als Auftragsverarbeiter
        beschreibt. [Vor endgültiger Freigabe prüfen und dokumentieren, ob und
        seit wann diese Vereinbarung für das konkret verwendete Cloudflare-Konto
        wirksam ist.]
      </p>
      <p>
        <strong>Übermittlungen außerhalb des EWR:</strong>
        Cloudflare betreibt eine international verteilte Infrastruktur. Nach den
        <a
          class={link}
          href="https://www.cloudflare.com/de-de/trust-hub/gdpr/"
          target="_blank"
          rel="noopener noreferrer">Datenschutzinformationen von Cloudflare</a
        >
        werden bestimmte technische Metadaten unter anderem in den USA und Europa
        verarbeitet. Das DPA sieht für Übermittlungen in die USA insbesondere das
        EU-US Data Privacy Framework und für entsprechend eingeschränkte Übermittlungen
        EU-Standardvertragsklauseln als Schutzmechanismen vor. Die Geltung im konkreten
        Vertragsverhältnis und die jeweils eingesetzten Empfänger sind zu prüfen.
        Cloudflare veröffentlicht eine
        <a
          class={link}
          href="https://www.cloudflare.com/gdpr/subprocessors/cloudflare-services/"
          target="_blank"
          rel="noopener noreferrer">Liste seiner Unterauftragsverarbeiter</a
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
        Der Mikrofonton wird von der Anwendung weder gespeichert noch an Cloudflare
        oder andere Server übertragen. Es werden keine Sprachaufzeichnungen oder Transkripte
        angelegt.
      </p>
      <p>
        Du kannst die Mikrofonberechtigung jederzeit in deinem Browser
        entziehen. Ohne Freigabe ist die Lautstärkemessung nicht nutzbar. Die
        Auswahl eines Mikrofons sowie Kalibrierungswerte können lokal auf deinem
        Gerät gespeichert werden.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>4. Lokale Speicherung auf deinem Gerät</h2>
    <div class={text}>
      <p>
        FlüsterWelt verwendet den lokalen Browserspeicher (<code
          >localStorage</code
        >), damit Einstellungen nach dem Schließen der Seite erhalten bleiben.
        Dazu gehören unter anderem: Sprache, Lautstärke- und
        Mikrofoneinstellungen, Kalibrierung, Klassenbezeichnungen, entdeckte
        Tiere und Szenenfortschritte, Timer-Einstellungen sowie selbst
        eingegebene Notiztexte und Zeichnungen.
      </p>
      <p>
        Diese Inhalte werden durch die Anwendung nicht auf einen
        FlüsterWelt-Server hochgeladen und nicht mit einem Benutzerkonto
        synchronisiert. Sie verbleiben grundsätzlich auf dem jeweiligen Gerät
        und im jeweiligen Browser, bis du sie in der Anwendung zurücksetzt oder
        die Website-Daten im Browser löschst.
      </p>
      <p>
        <strong>Hinweis für Schulen:</strong>
        Bitte verwende in Klassenbezeichnungen und Notizen möglichst keine personenbezogenen
        Daten von Schülerinnen und Schülern, insbesondere nicht auf gemeinsam genutzten
        Geräten.
      </p>
      <p>
        Für das Speichern und Auslesen von Informationen auf Endgeräten ist § 25
        TDDDG relevant. Eine Einwilligung ist unter anderem dann nicht
        erforderlich, wenn die Speicherung für den ausdrücklich gewünschten
        Dienst unbedingt notwendig ist. [Prüfen, ob dies auf alle angebotenen
        Speicherfunktionen zutrifft oder einzelne Funktionen eine gesonderte
        Einwilligung erfordern.]
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>5. Cookies und Reichweitenmessung</h2>
    <div class={text}>
      <p>
        Der FlüsterWelt-Anwendungscode setzt keine Werbe- oder Tracking-Cookies
        und enthält kein eigenes Analyse-Skript. Die im ursprünglichen
        Shy-Safari-Projekt verwendete Cloudflare-Webanalyse wurde aus diesem
        Fork entfernt.
      </p>
      <p>
        Auch in den derzeit ausgelieferten HTML-Seiten wurde kein
        Cloudflare-Web-Analytics-Skript festgestellt (Stand: November 2026).
        Dies betrifft die Reichweitenmessung per Skript und bedeutet nicht, dass
        beim Hosting keinerlei technische Verbindungsdaten verarbeitet werden.
        Hinweise dazu findest du in Abschnitt 2.
      </p>
      <p>
        Für FlüsterWelt ist Cloudflare Web Analytics deaktiviert. Cloudflare
        kann abhängig von den übrigen aktivierten Sicherheitsfunktionen
        technisch erforderliche Mechanismen einsetzen. [Etwaige zusätzliche
        Cloudflare-Sicherheitsfunktionen und Cookies vor der abschließenden
        Freigabe prüfen.]
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>6. Externe Links</h2>
    <div class={text}>
      <p>
        FlüsterWelt enthält Links zu externen Websites wie GitHub und
        teacher.dev. Erst wenn du diese Links öffnest, rufst du die jeweilige
        fremde Website auf. Dort gelten die Datenschutzinformationen des
        jeweiligen Anbieters.
      </p>
    </div>
  </section>

  <section class={card}>
    <h2 class={heading}>7. Deine Datenschutzrechte</h2>
    <div class={text}>
      <p>
        Soweit die jeweiligen gesetzlichen Voraussetzungen vorliegen, hast du
        Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der
        Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine auf
        Einwilligung gestützte Verarbeitung kannst du grundsätzlich mit Wirkung
        für die Zukunft widerrufen.
      </p>
      <p>
        Du kannst dich bei einer Datenschutzaufsichtsbehörde beschweren. Wende
        dich bei Fragen oder zur Ausübung deiner Rechte an die unter Abschnitt 1
        genannte Kontaktadresse.
      </p>
      <p>
        Eine automatisierte Entscheidungsfindung einschließlich Profiling findet
        durch die FlüsterWelt-Anwendung nicht statt.
      </p>
    </div>
  </section>

  <p class="mb-6 text-center text-sm text-slate-600">
    Stand: November 2026. Entwurf – vor Veröffentlichung prüfen und
    vervollständigen.
  </p>
</DocPage>
