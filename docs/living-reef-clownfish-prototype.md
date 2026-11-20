# Experiment: Erkundungsrunde des Clownfischs 🐠

**Status:** Ausschließlich im Branch `feature/living-reef-clownfish`.
Dieser Branch basiert auf `main` und übernimmt bewusst **keine**
Waldexperimente. Weder die öffentliche FlüsterWelt noch die Tierfunde,
Belohnungen, Lautstärkemessung oder andere Meerestiere werden verändert.

## Was ist anders als beim normalen Schwimmen?

Der bestehende Schwimmalgorithmus kann **bereits** Pausen an Wegpunkten
und Richtungswechsel ausführen. Wir fügen deshalb **keine weitere
Stoppen-und-Umschauen-Animation** hinzu.

Stattdessen verlässt ein Clownfisch gelegentlich kurz seinen normalen
Kurs, schwimmt **einen kleinen, weich gekrümmten ovalen Erkundungsbogen**
und kehrt an dessen Ausgangspunkt zurück. Anschließend nutzt er wieder
seine ganz normale Schwimmbewegung. Der Fisch bleibt die ganze Zeit in
Bewegung und schwimmt nicht plötzlich von einer Position zur nächsten.

- Individueller erster Versuch nach ungefähr **22–40 Sekunden**;
  danach weitere Gelegenheiten nach **85–145 Sekunden**.
- Die Erkundungsrunde dauert rund **8,2 Sekunden**, mit einer kurzen,
  weichen Rückkehr in die normale Steuerung.
- Die Runde wird nur begonnen, **wenn der Fisch bereits schwimmt**
  und genug Platz um ihn herum ist. Sonst versucht er es später.
- Größe und Richtung des Bogens variieren von Fisch zu Fisch. Die Bahn
  passt sich dem freien Platz an und bleibt in der bekannten Schwimmzone.
- In derselben Riffansicht ist immer nur **ein Clownfisch gleichzeitig**
  auf einer Sonderrunde. Andere schwimmen normal weiter.
- Bei Lehrer-Pause, zu viel Lärm, Flucht und aktivierter Funktion
  **„Bewegung reduzieren“** wird der Sondermoment sofort beendet.
- Die eigentliche Schwimm- und Belohnungslogik bleibt unverändert.

## Ausprobieren

1. Die Cloudflare-Vorschau des Branches öffnen, **Unterwasserwelt** auswählen.
2. Unter **Einstellungen → Erweitert → Alle Tiere erscheinen lassen** die
   vorhandene Testfunktion aktivieren.
3. Nach etwa **22–40 Sekunden** einen Clownfisch beobachten: Er sollte
   **einen erkennbaren kleinen Bogen mit weichem Richtungswechsel** schwimmen,
   statt nur anzuhalten. Andere Clownfische sollen nicht synchron kreisen.
4. Pause, „zu laut“, „Bewegung reduzieren“ und ein schwebendes Fenster
   überprüfen; kein Tier darf dabei springen oder abgelenkt wirken.

**Visuelle Abnahme erforderlich:** Die Zeit- und Bewegungsteile sind
automatisiert getestet. Ob die Runde wirklich natürlich aussieht, müssen
wir im Browser und möglichst am Smartboard beurteilen.
