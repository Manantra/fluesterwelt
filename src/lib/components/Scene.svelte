<script lang="ts">
  /**
   * The Scene itself: the only thing the class ever looks at.
   *
   * Nothing here reports a number, shows a meter or displays a "too loud"
   * badge. The single class-facing signal is the Scene clouding over — murky
   * water on the reef, a dusty haze on the savanna, interference breaking up
   * the signal in deep space — which is legible from the back of a room and
   * is not a button a child can press.
   * See docs/adr/0001-nothing-is-taken-away.md.
   */

  import type { SceneDef } from "$lib/scenes";
  import type { CreatureInstance } from "$lib/session/session.svelte";
  import { welcomeFor } from "$lib/scenes/welcome";
  import Creature from "./Creature.svelte";
  import HollowSign from "./HollowSign.svelte";

  let {
    scene,
    creatures,
    newestId,
    murky,
    frozen,
    listening,
    scares,
    fleeing,
    ondepart,
  }: {
    scene: SceneDef;
    creatures: CreatureInstance[];
    newestId: number | null;
    murky: boolean;
    /** Too Loud: everyone holds still, except any Creature running away. */
    frozen: boolean;
    /**
     * Paused: the teacher is talking, so every Creature stops and turns to
     * listen, modelling what the class should be doing.
     */
    listening: boolean;
    /**
     * The teacher chose "animals run away". The haze is then only a hint:
     * everyone freezing and bolting is the signal, and must stay sharp.
     */
    scares: boolean;
    /** Ids of the Creatures running away, or fading out. */
    fleeing: number[];
    /** A fleeing Creature has run out of sight, or faded away. */
    ondepart: (id: number) => void;
  } = $props();

  /** One the Scene answers to is here, or has just come. */
  const welcome = $derived(
    welcomeFor(scene.welcomes, creatures, newestId, fleeing),
  );
</script>

<div
  class="scene-stage absolute inset-0 overflow-hidden"
  data-scene={scene.id}
  data-murky={murky}
  data-frozen={frozen}
  data-listening={listening}
  data-scares={scares}
  data-welcome={welcome}
>
  <!--
    The whole landscape in one piece of artwork. It sits inside the container
    Too Loud filters, so a loud room clouds the Scene itself rather than
    tinting the animals in it.
  -->
  <div class="backdrop absolute inset-y-0">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html scene.ambientArt.backdrop}
  </div>

  <scene.Ambient />

  <!--
    Keyed by Scene as well: each Scene numbers its animals from 1, so an id
    alone would hand the reef's fish #3 component to the savanna's giraffe #3,
    and the giraffe would carry on with the fish's swimming motion.
  -->
  {#each creatures as creature (`${scene.id}:${creature.id}`)}
    <Creature
      {creature}
      sceneId={scene.id}
      art={scene.creatureArt[creature.def.slug]}
      listeningArt={scene.listeningArt[creature.def.slug]}
      depthFade={scene.depthFade}
      departure={creature.def.departure ?? scene.departure}
      whilePaused={scene.whilePaused}
      isNewest={creature.id === newestId}
      {frozen}
      {listening}
      fleeing={fleeing.includes(creature.id)}
      ongone={() => ondepart(creature.id)}
    />
  {/each}

  {#if scene.id === "halloween"}
    <HollowSign />
  {/if}

  <!-- One veil over the whole Scene, never a per-Creature effect. -->
  <div class="too-loud-veil pointer-events-none absolute inset-0"></div>
</div>
