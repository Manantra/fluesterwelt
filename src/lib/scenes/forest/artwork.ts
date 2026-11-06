/**
 * The forest artwork, as inlineable SVG source. Loaded the same way as
 * the reef's (`scenes/reef/artwork.ts`), for the same reasons.
 *
 * The files are inlined rather than loaded through `<img>` because the
 * animation layer moves part groups by class (`part-tail`, `part-head`, …),
 * and CSS cannot reach inside an `<img>`. Inlining is also why the art has
 * no ids but the backdrop's own `forest-`-prefixed light: every Creature on
 * screen shares one document. See `docs/svg-art-brief.md`.
 *
 * Eager, so a lazy fetch never lands at the moment an arrival has to be
 * unmissable.
 */

const creatureFiles = import.meta.glob("./creatures/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const listeningFiles = import.meta.glob("./listening/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const foxPoseFiles = import.meta.glob("./fox-poses/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const ambientFiles = import.meta.glob("./ambient/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function bySlug(files: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(files).map(([path, source]) => [
      path.slice(path.lastIndexOf("/") + 1, -".svg".length),
      source,
    ]),
  );
}

/** Creature artwork keyed by roster slug. */
export const CREATURE_ART = bySlug(creatureFiles);

/**
 * Creatures turned to face the class while the teacher talks, keyed by roster
 * slug. Not every Creature has one yet; those without just stop and turn.
 */
export const LISTENING_ART = bySlug(listeningFiles);

/** Three hand-drawn poses of the same fox (identical viewBox and ground line). */
export const FOX_POSE_ART = bySlug(foxPoseFiles);

/** Ambient Life and backdrop artwork keyed by filename stem. */
export const AMBIENT_ART = bySlug(ambientFiles);
