# Experiment: Lebendiger Wald

**Status:** Nur auf dem Branch `feature/living-forest-prototype`. Nicht mit
`main` zusammengeführt und nicht Teil der öffentlichen FlüsterWelt-Version.

## Worum geht es?

Im Wald können Tiere ein paar kleine, unaufdringliche Dinge tun, die nichts mit
dem Belohnungssystem zu tun haben:

- **Rotfuchs:** Nach seiner Ankunft läuft er zunächst normal. Nach etwa
  **16–26 Sekunden** bremst er kurz ab (**0,45 Sekunden**). Direkt danach
  senken sich Oberkörper und Kopf, die Beine knicken ein und der Schwanz
  rollt sich herum: **ein zusammenhängender Bewegungsablauf von 1,2 Sekunden**
  statt zweier lange gehaltener Zwischenbilder. Die süße eingerollte
  Schlafpose bleibt erhalten (**8–12 Sekunden**). Das **Aufstehen dauert
  nur 1,05 Sekunden** und spielt die Bewegungen umgekehrt ab. Erst danach
  läuft er weiter. Wiederholung nach etwa 85–130 Sekunden.
- **Grauhörnchen:** Nach ungefähr 18–36 Sekunden untersucht es zunächst
  neugierig seine **bereits in den Pfoten gehaltene Eichel**. Die Vorderpfoten
  schwenken gemeinsam mit der Eichel **bis unmittelbar an die Schnauze**;
  während des Knabberns gibt es nur kleine Bewegungen der Pfoten und Eichel,
  **kein rhythmisches Wippen des ganzen Körpers**. Die Eichel wird hinter
  die Schnauze gezeichnet, sodass beim Knabbern **ein kleiner Teil davon im
  Mund verschwindet**. Anschließend senkt es die Eichel wieder. Die vier Phasen sind
  Umschauen → Anheben → Knabbern → Absenken. Später hält das Eichhörnchen
  gelegentlich nur Ausschau. Nach einer Aktion vergehen normalerweise
  55–110 Sekunden bis zur nächsten.
- **Mehrere Tiere derselben Art:** Jedes Exemplar hat einen eigenen
  Zufallstimer. Zusätzlich darf **immer nur ein Fuchs und ein Grauhörnchen**
  pro Waldszene gleichzeitig eine besondere Aktion ausführen. Andere
  Exemplare laufen normal weiter und versuchen es später erneut. Nach dem
  ersten typischen Verhalten wechseln Füchse zwischen Schlafen und Schnüffeln,
  Eichhörnchen zwischen Knabbern an ihrer Eichel und Ausschauhalten.
- **Waldlichtung:** Ein **breiter, diffuser Sonnenlichtschimmer** wird ganz
  langsam heller und wieder dunkler, ohne wie ein plötzliches Lichtsignal
  aufzuleuchten. Der vollständige Zyklus dauert etwa **160 Sekunden**.

Alle Zeiten beziehen sich auf die Zeit, in der die Szene animiert werden darf;
beim Pausieren des Unterrichts, bei „zu laut“ oder beim Fliehen werden
Tiermomente abgebrochen. Bei `prefers-reduced-motion: reduce` entfallen
die zusätzlichen Tiermomente und der Lichtwechsel.

## So lässt sich der Branch ausprobieren

1. Im GitHub-Repository diesen Branch öffnen und lokal auschecken:
   `git switch feature/living-forest-prototype` (nach `git fetch origin`).
2. `npm install` und `npm run dev` ausführen.
3. FlüsterWelt starten und **Wald** als Szene auswählen.
4. Zum gezielten Testen im Bereich **Einstellungen → Erweitert**
   die vorhandene Funktion „Alle Tiere erscheinen lassen“ verwenden.
   Diese Funktion ist bereits Teil der App und trägt nichts in die Sammlung ein.
5. Fuchs und Grauhörnchen beobachten. Der erste Fuchs beginnt nach etwa
   **16–30 Sekunden** mit **Abbremsen → Hinlegen → Schlafen → Aufstehen**.
   Ein Grauhörnchen sollte nach **18–36 Sekunden** seine **eine vorhandene
   Eichel** zum Mund heben, daran knabbern und die Pfoten wieder senken.
   **Es darf keine zweite Eichel erscheinen.** Mehrere Füchse schlafen nicht
   gleichzeitig. Der diffuse Sonnenlichtschimmer braucht länger zum
   Ein- und Ausblenden; er darf nicht blitzen.
6. Mikrofon pausieren, „zu laut“ erzeugen und in den Betriebssystemeinstellungen
   „Bewegung reduzieren“ aktivieren: Die zusätzlichen Momente sollen dabei nicht
   ablenken.
7. Ein kurzes Testen auf einem Smartboard sowie im schwebenden Fenster
   (Document Picture-in-Picture) ist vor einer Freigabe zu empfehlen.

## Bewusst noch nicht umgesetzt

- Interaktionen zwischen mehreren Tieren (z. B. zwei Eichhörnchen begrüßen
  sich) benötigen eine gemeinsame, distanzabhängige Steuerung.
- Weitere Tierarten und Welten sind nicht verändert.
- Keine zusätzliche Einstellungsoberfläche. Vor dem Livegang wäre ein Schalter
  für „Lebendige Tiermomente“ sinnvoll.
- Keine neue lokale Speicherung, keine neue Datenerhebung und kein Backend.

## Technischer Aufbau

Die Datei forest/behaviors.ts enthält die individuelle Zustandsmaschine
mit vier möglichen Tieraktionen und Tests. forest/coordination.ts sorgt dafür,
dass mehrere Tiere derselben Art nicht gleichzeitig besondere Aktionen
starten. Eigene Timer und gelegentlich wechselnde Handlungen sorgen für
Abwechslung – auch beim gleichzeitigen Einblenden aller Tiere.

Die ursprüngliche Grauhörnchenzeichnung `gray-squirrel.svg` enthält bereits
eine Eichel und zwei Vorderpfoten. Diese vorhandenen SVG-Elemente sind
in der Gruppe `forest-squirrel-held-acorn` zusammengefasst und werden in
`scene.css` **um den Ansatz der Vorderpfote/Schulter gedreht**
(etwa 52 Grad bis unmittelbar vor den Mund), dezent geknabbert und wieder
abgesenkt. Die ursprüngliche Eichel/Pfoten-Gruppe wird in der SVG-Zeichenreihenfolge
**vor die Kopf- und Schnauzenformen** gesetzt. Dadurch überdecken diese beim
Anheben die Oberkante der Eichel auf natürliche Weise, ohne zusätzliche Maske
oder zweite Eichel. Dabei bleibt der Rumpf bewusst still; nur die Ohren zucken
beim Umschauen kurz.
`Creature.svelte` fügt **keine zusätzliche Eichel** mehr ein.

Creature.svelte nutzt stepSettle zum sanften Anhalten und bewahrt den Zustand
für das schwebende Fenster in einer WeakMap. Die originale red-fox.svg ist
in **Körper, Vorder-/Hinterbeine, Kopf und Schwanz** gruppiert, die während
des Hinlegens gemeinsam verschoben und gedreht werden. Die anatomisch
unglücklichen, statischen Zwischenbilder sit.svg und curl.svg sind entfernt.
Das Originalbild forest/fox-poses/sleep.svg mit der eingerollten Schlafposition
bleibt erhalten und wird am Ende der Bewegung sanft eingeblendet.
Beim Aufstehen läuft dieselbe Bewegung rückwärts. AmbientLife.svelte und
scene.css zeichnen den Sonnenfleck. Session, sightings, Tiergewichte und
Lautstärkealgorithmus bleiben unverändert.

**Visuelle Abnahme erforderlich:** Die Timing-Logik ist getestet, die
Wahrnehmung der Übergänge muss weiterhin im Browser und auf dem
Smartboard beurteilt werden.
