# Experiment: Lebendiger Wald

**Status:** Nur auf dem Branch `feature/living-forest-prototype`. Nicht mit
`main` zusammengeführt und nicht Teil der öffentlichen FlüsterWelt-Version.

## Worum geht es?

Im Wald können Tiere ein paar kleine, unaufdringliche Dinge tun, die nichts mit
dem Belohnungssystem zu tun haben:

- **Rotfuchs:** Nach seiner Ankunft läuft er zunächst normal. Nach etwa
  35–60 Sekunden kann er anhalten, sich klein machen und die Augen schließen.
  Die Ruhepause dauert etwa 9–14 Sekunden. Später schläft er wieder
  gelegentlich (Abstand etwa 110–170 Sekunden).
- **Grauhörnchen:** Es bleibt nach etwa 18–35 Sekunden kurz stehen, richtet
  sich auf und schaut sich um. Die Pause dauert etwa 4–7 Sekunden und
  wiederholt sich unregelmäßig nach etwa 65–110 Sekunden.
- **Waldlichtung:** Ein dezenter warmer Sonnenfleck erscheint und verschwindet
  langsam in einem etwa 140 Sekunden langen Zyklus.

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
5. Fuchs und Grauhörnchen beobachten; die Pausen erscheinen unregelmäßig.
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

`forest/behaviors.ts` ist eine kleine pure Zustandsmaschine mit injizierter
Zufallsquelle und eigenen Tests. `Creature.svelte` nutzt den bereits
vorhandenen `stepSettle`-Mechanismus zum sanften Anhalten und wahrt den Zustand
über das schwebende Fenster in einer `WeakMap`. Die CSS-Szenenregeln und
`AmbientLife.svelte` setzen die visuellen Momente um. Es werden weder
`Session`, `sightings`, die Tiergewichte noch der Lautstärkealgorithmus verändert.
