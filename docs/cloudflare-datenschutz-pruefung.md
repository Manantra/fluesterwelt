# Datenschutzprüfung Cloudflare Pages – FlüsterWelt

Stand: 6. November 2026. **Interne Arbeitsnotiz / Review-Checkliste**, keine verbindliche Rechtsberatung.

## Technische Ausgangslage

- Web-App als statische SvelteKit-Website via Cloudflare Pages: `https://fluesterwelt.familiemenges.de/`.
- Kein eigenes Nutzerkonto, keine eigene serverseitige Nutzerdatenbank; Einstellungen, Klassen und Notizen werden lokal im Browser gespeichert.
- Mikrofonlautstärke wird nur im Browser verarbeitet; die App zeichnet keinen Ton auf und lädt diesen nicht hoch.
- Cloudflare Web Analytics ist laut Betreiber deaktiviert; in der ausgelieferten HTML-Version wurde kein Analytics-Beacon gefunden.
- Der Betreiber nutzt Cloudflare Pages und Netcup-DNS. Der Strato-VPS mit Pangolin ist nicht der Website-Host.

## Belegte Informationen aus offiziellen Cloudflare-Quellen

1. **AVV / DPA:** Cloudflare veröffentlicht das *Customer Data Processing Addendum*, Version 6.4 vom **3. April 2026**. Das DPA beschreibt Cloudflare als Auftragsverarbeiter bei einschlägigen Datenverarbeitungen im Auftrag des Kunden. Es wird erst wirksam, wenn die Parteien es in der vorgesehenen Weise vereinbart haben. Ob dies im konkreten Konto vorliegt, kann aus öffentlich zugänglichen Informationen **nicht festgestellt** werden.
   Quelle: https://www.cloudflare.com/cloudflare-customer-dpa/

2. **Technische Metadaten:** Cloudflare erklärt, bestimmte Besucher- und Netzwerkmetadaten, häufig IP-Adressen, in den USA und Europa zu verarbeiten. Der Globale Netzwerkbetrieb ist nicht auf Deutschland beschränkt.
   Quelle: https://www.cloudflare.com/de-de/trust-hub/gdpr/

3. **Drittlandübermittlungen:** Das DPA behandelt das EU-US Data Privacy Framework; für entsprechend eingeschränkte Transfers sieht es EU-Standardvertragsklauseln vor. Welche Vertragsgrundlage beim Betreiber konkret gilt, muss anhand der Account-/Vertragsunterlagen festgestellt werden.
   Quelle: https://www.cloudflare.com/cloudflare-customer-dpa/

4. **Aufbewahrung:** Cloudflares Privacy Policy beschreibt zweck- und rechtsgrundlagenbezogene Aufbewahrungskriterien, keine einheitliche feste Frist für sämtliche Besucherdaten bei Pages. Annex 1 des DPA nennt das Ende der erforderlichen Verarbeitung bzw. des Hauptvertrags als maßgeblichen Rahmen. **Nicht daraus ableiten:** eine allgemeine Löschfrist von z. B. 24 Stunden, 7 oder 30 Tagen für alle IP-Adressen.
   Quellen: https://www.cloudflare.com/privacypolicy/ · https://www.cloudflare.com/cloudflare-customer-dpa/

5. **Analyse ≠ Logs:** Cloudflare dokumentiert inzwischen wenigstens 30 Tage Abrufbarkeit bestimmter Analytics-Daten auf allen Plänen (teilweise 31 Tage Aufbewahrung). Diese Angabe ist *nicht* mit der Speicherdauer individueller Besucherprotokolle gleichzusetzen. Die spezifischen Logpull- und Workers-Logs-Vorgaben sind nicht automatisch auf statische Pages-Assets anwendbar.
   Quellen: https://developers.cloudflare.com/changelog/post/2026-10-02-30-days-analytics-on-every-plan/ · https://developers.cloudflare.com/logs/logpull/enabling-log-retention/ · https://developers.cloudflare.com/workers/platform/pricing/

6. **Unterauftragsverarbeiter:** Cloudflare stellt eine Liste der Subprozessoren und ihrer Zwecke zur Verfügung; die tatsächliche Relevanz hängt vom genutzten Dienst ab.
   Quelle: https://www.cloudflare.com/gdpr/subprocessors/cloudflare-services/

7. **Web Analytics auf Pages:** Web Analytics wird als optionale Funktion über die Pages-Projektmetriken aktiviert und verwendet einen Script-Beacon. Für FlüsterWelt ist es laut Betreiber deaktiviert.
   Quelle: https://developers.cloudflare.com/pages/how-to/web-analytics/

## Vor endgültiger Veröffentlichung noch zu prüfen

- [ ] Unterlagen im Cloudflare-Konto prüfen und **Wirksamkeit des DPA/AVV** festhalten. Die öffentlich abrufbare DPA-Vorlage allein ist kein Nachweis über ein abgeschlossenes Abkommen.
- [ ] Etwaige zusätzliche Produkte und Sicherheitsfunktionen in Cloudflare Pages / Account prüfen: Browser-Challenges, Bot-Schutz, Turnstile, Access, Worker/Pages Functions, Logpush, Web Analytics. Fehlende Funktionen nicht fälschlich als aktiv beschreiben.
- [ ] Wenn präzise Rohlog-Löschfristen erforderlich sind: schriftliche Bestätigung für das genutzte Konto/Produkt bei Cloudflare erfragen. Ohne Nachweis nur **belegte Kriterien** statt erfundener Zeiträume angeben.
- [ ] Rechtliche Einschätzung zur Speicherung nach § 25 TDDDG (notwendige / optionale `localStorage`-Funktionen).
- [ ] Relevanz weiterer Impressumspflichten (§ 18 MStV / § 5 DDG) anhand der konkreten Angebotsform prüfen.
- [ ] Datenschutzerklärung und Impressum final freigeben und erst dann Pull Request #1 in `main` übernehmen.

**Sicherheitsregel:** Keine Cloudflare-API-Tokens, privaten Zugangsdaten oder Vertragsdokumente in GitHub-Commits oder Issue-Kommentare aufnehmen.
