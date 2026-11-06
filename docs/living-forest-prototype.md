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
- **Grauhörnchen:** Nach ungefähr 18–36 Sekunden kann es eine kleine
  **Eichel am Boden entdecken**, sich ihr zuwenden, sie **in die Pfoten heben**,
  einige Sekunden knabbern und sie schließlich aufessen. Der Ablauf hat
  eigene Phasen (Suchen → Aufheben → Knabbern → letzter Bissen). Bei späteren
  Gelegenheiten schaut es stattdessen auch einfach neugierig umher.
  Nach einer Aktion vergehen normalerweise 55–110 Sekunden bis zur nächsten.
- **Mehrere Tiere derselben Art:** Jedes Exemplar hat einen eigenen
  Zufallstimer. Zusätzlich darf **immer nur ein Fuchs und ein Grauhörnchen**
  pro Waldszene gleichzeitig eine besondere Aktion ausführen. Andere
  Exemplare laufen normal weiter und versuchen es später erneut. Nach dem
  ersten typischen Verhalten wechseln Füchse zwischen Schlafen und Schnüffeln,
  Eichhörnchen zwischen Eichelsuche und Ausschauhalten.
- **Waldlichtung:** Ein jetzt stärker erkennbarer warmer Sonnenfleck erscheint
  in einem kleinen Bereich der Lichtung und verschwindet langsam. Zyklus:
  etwa 95 Sekunden, sichtbare Phase etwa zwischen Sekunde 10 und 50.

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
   Ein Grauhörnchen sollte nach **18–36 Sekunden** eine Eichel entdecken,
   aufheben und knabbern. **Mehrere Füchse schlafen nicht gleichzeitig**.
   Der Sonnenfleck sollte ebenfalls sichtbar sein.
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

Creature.svelte zeigt die kleine Eichel als SVG innerhalb der bestehenden
Grauhörnchen-Zeichenfläche; die CSS-Animation hebt sie vom Boden in die
Vorderpfoten und führt kleine Knabberbewegungen aus.

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
