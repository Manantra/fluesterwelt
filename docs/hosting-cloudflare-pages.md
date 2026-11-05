# FlüsterWelt auf Cloudflare Pages bereitstellen

**Zieladresse:** https://fluesterwelt.familiemenges.de  
**GitHub:** https://github.com/Manantra/fluesterwelt  
**DNS:** Netcup (autoritative Nameserver bei netcup)  
**Vorhandene Infrastruktur:** Strato-VPS mit Pangolin

## Wichtig vor dem Start

Die Website enthält vorerst einen **Entwurf** der Datenschutzhinweise und ein
**unvollständiges Impressum mit Platzhaltern**. Beide müssen vor dem öffentlichen
Launch entsprechend den tatsächlichen Betreiber- und Hostingdaten fertiggestellt
und geprüft werden. Bestehende Netcup-Records und Pangolin-Routen dürfen nicht
pauschal überschrieben oder gelöscht werden.

## 1. Pages-Projekt über GitHub anlegen

1. Im [Cloudflare-Dashboard](https://dash.cloudflare.com/) anmelden.
2. **Workers & Pages → Create application → Pages → Import existing Git repository**.
3. GitHub-Zugriff für **Manantra/fluesterwelt** erlauben (möglichst nur dieses Repository).
4. Neues Projekt mit dem gewünschten Namen `fluesterwelt` erstellen.
5. Folgende Werte eintragen:

| Einstellung            | Wert                                                  |
| ---------------------- | ----------------------------------------------------- |
| GitHub-Repository      | `Manantra/fluesterwelt`                               |
| Production branch      | `main`                                                |
| Root directory         | `/`                                                   |
| Build command          | `npm run build`                                       |
| Build output directory | `build`                                               |
| Node.js                | via `.node-version` gepinnt auf `22.23.4`             |
| Environment variable   | `VITE_SITE_URL=https://fluesterwelt.familiemenges.de` |

`build` ist korrekt, da dieses Projekt den SvelteKit-Adapter `adapter-static`
benutzt – nicht die dynamische Cloudflare-Adapter-Ausgabe.

6. Projekt speichern und den ersten Build starten.
7. **Die tatsächlich von Cloudflare zugewiesene `*.pages.dev`-Adresse
   notieren**. Der Name `fluesterwelt.pages.dev` ist nur ein Wunschname.

Cloudflare stellt nach erfolgreichem Import automatische Builds von `main`
und Vorschau-Builds für Pull Requests bereit.

## 2. Prüfung der Pages-Testadresse

VOR der DNS-Umstellung folgende Punkte kontrollieren:

- Build erfolgreich und `index.html` wird ausgeliefert.
- FlüsterWelt-Logo, deutsche Bedienoberfläche und Szenen sind sichtbar.
- Keine unerwünschten Cloudflare-Analytics-Skripte oder alten Bildvorschauen.
- Datenschutz- und Impressumsseiten sind erreichbar, aber noch nicht als
  rechtlich abschließend freigegeben.
- Die Mikrofonfunktion im HTTPS-Browser prüfen.

## 3. Custom Domain erst bei Cloudflare hinzufügen

Im Pages-Projekt **Custom domains → Set up a domain** wählen:

`fluesterwelt.familiemenges.de`

Cloudflare erwartet bei extern verwalteter DNS-Zone einen CNAME auf
die **tatsächlich zugeteilte** Pages-Adresse.

**Wichtig:** Cloudflare weist ausdrücklich darauf hin, dass ein CNAME
allein ohne vorherige Custom-Domain-Verknüpfung im Pages-Projekt nicht reicht.

## 4. DNS bei Netcup ändern

Öffentliche DNS-Prüfung vom 5. November 2026:
`fluesterwelt.familiemenges.de` liefert `87.106.45.125`. Eine
zufällige nicht existierende Subdomain liefert dieselbe Adresse – das
spricht für einen Wildcard-A-Record, nicht zwingend für einen expliziten
Hosteintrag.

Im Netcup-DNS-Panel prüfen, ob `fluesterwelt` eigene A-/AAAA-/CNAME-
Records besitzt:

- Einen expliziten alten A-/AAAA-Eintrag **nur für `fluesterwelt`**
  entfernen, falls vorhanden.
- Einen CNAME für **`fluesterwelt`** auf die Cloudflare-Pages-Adresse
  setzen, z. B. `fluesterwelt.pages.dev`, **falls tatsächlich zugeteilt**.
- Wildcard `*`, Root-Einträge, sonstige Subdomains und Netcup-Nameserver
  **nicht verändern**.

Die spezifische Subdomain hat Vorrang vor dem Wildcard-Record und wird
dadurch direkt zu Cloudflare geführt, ohne Pangolin für die übrigen
Subdomains zu beeinträchtigen.

## 5. DNS, Zertifikat und Anwendung testen

```sh
dig +short CNAME fluesterwelt.familiemenges.de
curl -I https://fluesterwelt.familiemenges.de/
curl -I https://fluesterwelt.familiemenges.de/og-image.png
```

Nach erfolgreicher DNS-/Zertifikatsprüfung die Anwendung von mehreren
Browsern testen: Mikrofon, Lautstärkeanzeige, Tiere, Pausieren,
Klassenwechsel, Timer, Sammelalbum, Datenschutz, Impressum und
Linkvorschau. HTTPS ist für den Mikrofonzugriff erforderlich.

## 6. Datenschutz / Betreiberangaben

In `src/routes/privacy/+page.svelte` und
`src/routes/impressum/+page.svelte` fehlen noch echte Angaben.
Insbesondere zu klären sind:

- Name/Organisation, ladungsfähige Anschrift, Kontakt-E-Mail
- Cloudflare als Host, Vertrags-/Auftragsverarbeitungsfragen
- Serverlogs, Aufbewahrungsdauer, etwaige Drittlandübermittlungen
- passende Rechtsgrundlagen und lokale Endgerätespeicherung

**Keine Zugangsdaten, API-Token oder private Adressen in GitHub committen.**

## 7. Updates

Ein Push auf `main` löst nach GitHub-Verknüpfung automatisch einen
Pages-Build aus. Unsere GitHub-Actions-Prüfung läuft zusätzlich bei
Pushes und Pull Requests. Eine Änderung an Pangolin oder dem Strato-VPS
ist für diese Hostingvariante nicht notwendig.

[Cloudflare: Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) ·
[Cloudflare: SvelteKit mit adapter-static](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/) ·
[Cloudflare: Buildkonfiguration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
