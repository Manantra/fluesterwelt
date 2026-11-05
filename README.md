# FlüsterWelt 🇩🇪

**FlüsterWelt** ist die deutschsprachige Weiterentwicklung von [Shy Safari](https://github.com/teacherdotdev/shy-safari): einer interaktiven, kostenlosen Lautstärkeanzeige für das Klassenzimmer. In ruhigen Arbeitsphasen zeigen sich nach und nach Tiere und Entdeckungen in unterschiedlichen Welten.

Die Benutzeroberfläche ist vollständig auf Deutsch übersetzt. Deutsch ist bei einem ersten Besuch voreingestellt; Englisch, Spanisch und Französisch bleiben auswählbar. Die Mikrofonlautstärke wird im Browser gemessen, ohne Tonaufnahmen zu speichern oder zu übertragen.

**Technik:** Svelte 5, SvelteKit, TypeScript. Für einen lokalen Start `npm install` und `npm run dev`, für einen statischen Produktionsbuild `npm run build`. Die erstellten Dateien liegen unter `build/` und benötigen für den Mikrofonzugriff beim Hosting HTTPS.

## Vor dem öffentlichen Start

- **Domain konfigurieren:** `VITE_SITE_URL=https://deine-domain.tld npm run build`
  setzt kanonische Seitenlinks, Sitemap sowie die URL der Linkvorschau
  auf die eigene HTTPS-Domain. Ohne Konfiguration wird **keine fremde
  Website als kanonische Adresse ausgegeben**; die Bildvorschau greift
  ersatzweise auf das eigene öffentliche GitHub-Repository zurück.
- **Datenschutz und Impressum vervollständigen:** Betreiberangaben,
  ladungsfähige Anschrift, E-Mail, Hostingunternehmen, Serverprotokolle,
  Löschfristen, rechtliche Grundlagen und mögliche Auftragsverarbeiter
  in den Dateien `src/routes/privacy/+page.svelte` und
  `src/routes/impressum/+page.svelte` ergänzen.
- Die Webseite über **HTTPS** bereitstellen, damit die Browser-Mikrofonfreigabe
  zuverlässig verfügbar ist.
- Die Endgerätespeicherung (insbesondere optionale Daten im Browser) auf
  Einwilligungsbedürftigkeit nach § 25 TDDDG prüfen.
- **Kein Tracking eingebaut:** Die ursprüngliche Cloudflare-Webanalyse
  wurde für FlüsterWelt entfernt. Der Host kann unabhängig davon
  technische Serverlogs verarbeiten.

Die Linkvorschau stammt aus `static/og-image.svg` und wird als
`static/og-image.png` (1200 × 630 Pixel) eingebunden; das Fuchslogo
liegt unter `src/lib/brand/logo.svg`. Favicon und Apple-Touch-Icon
nutzen dasselbe Motiv.

**Lizenz und Dank:** Fork des Projekts von [teacher.dev](https://teacher.dev), veröffentlicht unter der Apache License 2.0. Die ursprüngliche Lizenzdatei `LICENSE.txt` bleibt erhalten. Siehe auch [NOTICE.md](NOTICE.md).

---

## Originaldokumentation (Englisch)

A calm scene on the classroom projector — a savanna, a coral reef, deep
space, the age of dinosaurs, a woodland clearing, the jungle or the Arctic — where animals (or, in deep space, sightings
through a telescope) come out the longer the room stays quiet. The animals are shy: if the room is too loud,
they stay hidden until it is calm again.

It is the opposite of a noise meter. There is no bouncing, no score, no red
warning light — nothing that makes being loud more interesting than being
quiet. The class starts with an empty scene. The first animal comes out
after 10–20 quiet seconds, as a taste of what is coming; after that, every few
minutes of quiet working brings another one. Some of them are rare.

## What a teacher does

1. Open the page and press **Start listening**. The browser asks for the
   microphone; audio is measured on the computer and never recorded or sent
   anywhere.
   Pick **Savanna** (zebras, giraffes, lions), **Coral reef** (fish,
   turtles, sharks), **Deep space** (satellites, comets, galaxies),
   **Prehistoric** (T. rex, Triceratops, feathered raptors), **Forest**
   (squirrels, foxes, deer), **Jungle** (sloths, toucans, jaguars) or
   **Arctic** (polar bears, seals, narwhals) first if you like. Deep space and
   the prehistoric scene are drawn to appeal to older students too.
2. Press **Start**. The class begins earning animals.
3. Move the mouse to bring up the controls. **Settings** has everything:
   which scene, which microphone, how loud is too loud, and how often animals
   arrive. Each scene keeps its own animals, so switching never loses any.

That is the whole app. No account, no sign-in, nothing to install.

## How it decides the room is too loud

The teacher sets a **Volume Goal** — Silent, Independent or Partner work, or
anywhere in between by dragging the line on the meter. While the room stays
under it, animals arrive. To watch the room's level live without opening
Settings, turn on **Show on screen** beside the Noise Meter: it stays at the
top of the scene until you turn it off.

Going over the line does not instantly stop anything. Noise over the goal
fills up a bucket, and the further over, the faster it fills: just over the
line takes about **six seconds** to pause arrivals, far over takes about
**one second**. Quiet moments drain the bucket again, so a knock at the door or
a dropped book costs the class nothing. Recovery takes only **three seconds**,
because a class that settles down should be rewarded immediately rather than
serve a sentence.

When the room is too loud, the whole scene slowly clouds over — a dusty haze
on the savanna, murky water on the reef, interference in deep space, mist off the river in the
prehistoric scene, fog between the trees in the forest, a tropical downpour in the jungle, a whiteout of blowing snow in the Arctic. That is
the only signal the class sees. The shy animals simply wait to come out:
nothing already out runs away, nothing gets startled, and progress
toward the next animal pauses rather than resetting — a loud spell costs
exactly the time it lasted. This is deliberate; see
[docs/adr/0001](docs/adr/0001-nothing-is-taken-away.md).

**Calibration** is optional. The app works on a sensible default, and
calibrating — five seconds of silence, five seconds of normal talking — makes
the meter match your room and your microphone.

## Running it locally

This project lives in a shared workspace where several agents run dev servers
at once, so ports are leased rather than hardcoded. From the **workspace
root**:

```sh
./scripts/agent-dev.mjs class-noise-level --no-pocketbase
```

Other useful commands, from this directory:

```sh
bun run check    # typecheck
bun test         # unit tests
bun run lint     # prettier + eslint
bun run build    # static production build into build/
```

Note for this FlüsterWelt fork: optional Cloudflare Web Analytics was removed
from the application.

## How it is put together

Svelte 5 and SvelteKit, prerendered to static files with Tailwind for styling.
There is no backend: settings live in `localStorage` and nothing leaves the
device.

Each scene is SVG in the DOM rather than video or canvas
([docs/adr/0002](docs/adr/0002-svg-dom-scene.md)), so each animal is an
ordinary element that CSS animates.

The three decisions that matter most are pure functions with unit tests, so
they can be checked without a microphone or a ten-second wait:

- `src/lib/noise/loudState.ts` — the slow-in, fast-out hysteresis.
- `src/lib/session/arrivalClock.ts` — banking quiet time, and pausing rather
  than resetting.
- `src/lib/session/roll.ts` — the weighted rarity roll.

`CONTEXT.md` defines the vocabulary the code uses. `docs/` holds the
architecture decisions, the implementation plan, and the brief for drawing the
reef artwork, whose style rules the savanna, the forest, the jungle and the Arctic follow too; deep
space, the prehistoric scene, the forest, the jungle and the Arctic each have their own section there.
