<script lang="ts">
  /**
   * Scenery that is alive but is not a Creature: oaks, maples, pines and
   * birches round the clearing, ferns stirring, toadstools, a mossy log and
   * a stump, leaves drifting down, motes turning in the sunlit clearing, and
   * a far-off flock crossing the sky. Present from the first second of
   * every Session, never earned, never counted.
   *
   * It exists because an unpopulated wood otherwise reads as "this app is
   * broken" rather than "we have not earned anything yet". Everything here is
   * deliberately subordinate: smaller, muted, lower contrast, and without the
   * signature eye that every Creature has. It is also slow: this runs on a
   * projector all day.
   *
   * The artwork is `src/lib/scenes/forest/ambient/`; the scatter below is
   * what places it. Positions are fixed rather than random, so the Scene
   * looks the same each time a teacher opens it.
   */

  import { AMBIENT_ART } from "$lib/scenes/forest/artwork";
  import { groundLayer } from "$lib/scenes/motion";

  /**
   * Everything rooted in the ground, spread through its whole depth. `base`
   * is the distance from the bottom of the Scene: the clearing runs from
   * about 38% (its far edge, under the trees) down to the bottom edge. Nearer
   * pieces are drawn bigger, and each is layered by that depth so an animal
   * walking the clearing passes in front of some scenery and behind the rest
   * — the same depth scale Creatures use (`scenes/motion.ts`).
   *
   * Ferns are sized by height (they sway about their root); everything else
   * by width. The trees stand round the edge of the clearing, leaving its
   * middle open for the animals and the sky above it for the birds.
   */
  const ground = [
    // Back row, along the far edge of the clearing.
    { x: 2, base: 38, size: 13, art: "oak" },
    { x: 13, base: 37.5, size: 6, art: "pine" },
    { x: 21, base: 37, size: 6, art: "bush" },
    { x: 30, base: 37.5, size: 4.5, art: "birch" },
    { x: 41, base: 37, size: 4.5, art: "fern" },
    { x: 57, base: 37, size: 4, art: "flowers" },
    { x: 66, base: 37.5, size: 5, art: "birch" },
    { x: 74, base: 38, size: 11, art: "maple-autumn" },
    { x: 86, base: 37.5, size: 6.5, art: "pine" },
    // Middle of the clearing.
    { x: 6, base: 25, size: 9, art: "fern" },
    { x: 19, base: 27, size: 5, art: "mushrooms" },
    { x: 33, base: 22, size: 6, art: "rock" },
    { x: 50, base: 28, size: 5, art: "flowers" },
    { x: 62, base: 24, size: 5.5, art: "stump" },
    { x: 79, base: 26, size: 8, art: "fern" },
    { x: 90, base: 20, size: 5, art: "mushrooms" },
    // Front row, right at the bottom edge.
    { x: -7, base: 0, size: 24, art: "pine" },
    { x: 12, base: 1, size: 16, art: "fern" },
    { x: 27, base: 1, size: 17, art: "log" },
    { x: 47, base: 2, size: 7, art: "flowers" },
    { x: 58, base: 1, size: 10, art: "bush" },
    { x: 74, base: 2, size: 7, art: "mushrooms" },
    { x: 84, base: 0, size: 20, art: "oak" },
  ]
    .map((piece) => ({
      ...piece,
      fern: piece.art === "fern",
      // On the same scale as Creatures, by where the piece meets the ground.
      layer: groundLayer(1 - piece.base / 100),
      sway: 5 + ((Math.abs(piece.x) * 7) % 30) / 10,
    }))
    .sort((a, b) => a.layer - b.layer);

  /**
   * Motes turning in the sun over the clearing, rising and fading on their
   * own beat. No sunbeams: the clearing is open to the sky, so there is no
   * canopy for a beam to come through.
   */
  const motes = [
    { x: 24, top: 18, width: 16, duration: 38, delay: -6 },
    { x: 50, top: 8, width: 20, duration: 46, delay: -27 },
    { x: 69, top: 22, width: 14, duration: 41, delay: -16 },
  ];

  /**
   * Leaves coming down, one at a time and never in step: each falls the
   * whole height of the Scene, swaying, and lands out of sight in the grass.
   */
  const leaves = [
    { x: 8, size: 1.5, art: "leaf-1", duration: 23, delay: -3 },
    { x: 22, size: 1.2, art: "leaf-2", duration: 27, delay: -17 },
    { x: 37, size: 1.4, art: "leaf-3", duration: 25, delay: -9 },
    { x: 55, size: 1.3, art: "leaf-1", duration: 29, delay: -22 },
    { x: 68, size: 1.6, art: "leaf-2", duration: 24, delay: -12 },
    { x: 81, size: 1.2, art: "leaf-3", duration: 28, delay: -1 },
    { x: 93, size: 1.4, art: "leaf-2", duration: 26, delay: -19 },
  ].map((leaf) => ({
    ...leaf,
    // A beat of its own for the swing, so no two swing together.
    swing: 3.2 + ((leaf.x * 7) % 18) / 10,
  }));

  const flocks = [
    { y: 13, width: 7, duration: 160, delay: -30 },
    { y: 27, width: 5, duration: 210, delay: -130 },
  ];

  /** In front of the far half of the clearing, behind the near half. */
  const LEAF_LAYER = groundLayer(0.8);
</script>

<!-- An occasional patch of warm sunlight on the clearing, not a new reward.
     Fully decorative, behind the near animals and without any sound. -->
<div
  class="forest-clearing-sunlight pointer-events-none absolute"
  aria-hidden="true"
></div>

<!-- A far-off flock: silhouette only, no eyes, no detail. Clearly not a Creature. -->
{#each flocks as flock (flock.y)}
  <div
    class="forest-flock pointer-events-none absolute"
    style="top:{flock.y}%; width:calc({flock.width} * var(--wu)); animation-duration:{flock.duration}s; animation-delay:{flock.delay}s;"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html AMBIENT_ART.birds}
  </div>
{/each}

{#each motes as field (field.x)}
  <div
    class="forest-motes pointer-events-none absolute"
    style="left:calc(var(--world-left) + {field.x} * var(--wu)); top:{field.top}%; width:calc({field.width} * var(--wu)); animation-duration:{field.duration}s; animation-delay:{field.delay}s;"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html AMBIENT_ART.motes}
  </div>
{/each}

<!-- Trees, ferns, toadstools, logs and stones, rooted in the clearing. -->
{#each ground as piece (`${piece.x}:${piece.base}`)}
  {#if piece.fern}
    <div
      class="forest-fern pointer-events-none absolute"
      style="left:calc(var(--world-left) + {piece.x} * var(--wu)); bottom:{piece.base}%; height:{piece.size}%; z-index:{piece.layer}; animation-duration:{piece.sway}s;"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html AMBIENT_ART.fern}
    </div>
  {:else}
    <div
      class="scenery pointer-events-none absolute"
      style="left:calc(var(--world-left) + {piece.x} * var(--wu)); bottom:{piece.base}%; width:calc({piece.size} * var(--wu)); z-index:{piece.layer};"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html AMBIENT_ART[piece.art]}
    </div>
  {/if}
{/each}

{#each leaves as leaf (leaf.x)}
  <div
    class="forest-leaf-fall pointer-events-none absolute top-0"
    style="left:calc(var(--world-left) + {leaf.x} * var(--wu)); width:calc({leaf.size} * var(--wu)); z-index:{LEAF_LAYER}; animation-duration:{leaf.duration}s; animation-delay:{leaf.delay}s;"
  >
    <div
      class="forest-leaf"
      style="animation-duration:{leaf.swing}s; animation-delay:{leaf.delay}s;"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html AMBIENT_ART[leaf.art]}
    </div>
  </div>
{/each}
