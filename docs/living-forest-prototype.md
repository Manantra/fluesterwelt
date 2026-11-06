# Experiment: Lebendiger Wald

**Status:** Nur auf dem Branch `feature/living-forest-prototype`. Nicht mit
`main` zusammengeführt und nicht Teil der öffentlichen FlüsterWelt-Version.

## Worum geht es?

Im Wald können Tiere ein paar kleine, unaufdringliche Dinge tun, die nichts mit
dem Belohnungssystem zu tun haben:

- **Rotfuchs:** Nach seiner Ankunft läuft er zunächst normal. Nach etwa
  **16–26 Sekunden** wird er langsamer (1,2 Sekunden), **setzt sich sichtbar
  hin** (2,5 Sekunden), **rollt sich ein** (2,1 Sekunden), **schließt die
  Augen und schläft** (8–12 Sekunden). Anschließend **richtet er sich auf**
  (2,5 Sekunden) und läuft weiter. Dafür besitzt er drei separat gezeichnete
  SVG-Posen statt einer gestauchten Laufanimation. Wiederholung nach etwa
  85–130 Sekunden.
- **Grauhörnchen:** Es bleibt nach etwa 18–35 Sekunden kurz stehen, richtet
  sich auf und schaut sich um. Die Pause dauert etwa 4–7 Sekunden und
  wiederholt sich unregelmäßig nach etwa 65–110 Sekunden.
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
5. Fuchs und Grauhörnchen beobachten. Der Fuchs beginnt nach etwa
   **16–26 Sekunden** mit dem neuen Ablauf: **Hinsetzen → Einrollen →
   Schlafen → Aufstehen**. Der Sonnenfleck sollte ebenfalls deutlicher sein.
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

Die Datei forest/behaviors.ts enthält eine pure Zustandsmaschine mit Tests.
Creature.svelte nutzt stepSettle zum sanften Anhalten und bewahrt den Zustand
für das schwebende Fenster in einer WeakMap. Drei eigens gezeichnete
Vektorillustrationen in forest/fox-poses/ (sit.svg, curl.svg und sleep.svg)
haben dieselbe Zeichenfläche und den gleichen Bodenstand wie die Laufpose.
Die überblendeten Bilder zeigen die Phasen ohne Positionssprung.
AmbientLife.svelte und scene.css zeichnen den Sonnenfleck.
Session, sightings, Tiergewichte und Lautstärkealgorithmus bleiben unverändert.
