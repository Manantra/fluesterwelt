<script lang="ts" module>
  import type { MotionState } from "$lib/scenes/motion";
  import type { CreatureInstance } from "$lib/session/session.svelte";
  import type { ForestBehaviorState } from "$lib/scenes/forest/behaviors";
  import { ForestMomentCoordinator } from "$lib/scenes/forest/coordination";

  /**
   * Keep the interval across the Document PiP window move. The same
   * CreatureInstance remains alive, even though its component is remounted.
   */
  const forestStates = new WeakMap<CreatureInstance, ForestBehaviorState>();

  /** Nearby copies of the same species never perform special acts together. */
  const forestCoordinator = new ForestMomentCoordinator<
    HTMLElement,
    CreatureInstance
  >();

  /**
   * Where each Creature had got to, so one that is drawn afresh — when the
   * Scene floats out of the tab or comes back — carries on from the same
   * spot rather than jumping back to where it arrived.
   */
  const motions = new WeakMap<CreatureInstance, MotionState>();
</script>

<script lang="ts">
  /**
   * One Creature living in the Scene.
   *
   * Creatures never leave, so none of them crosses and wraps: each one
   * wanders inside the Scene in its species' own way (`scenes/motion.ts`) —
   * crabs walk the sand, zebras graze the plain, the big animals make slow
   * wide loops. The motion runs per frame in script because it steers towards
   * waypoints, which CSS keyframes cannot do. Depth still drives size,
   * layering and speed, which is what stops twenty Creatures reading as one
   * flat sheet of stickers.
   */

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    advanceForestBehavior,
    behaviorForCreature,
    createForestBehavior,
    type ForestBehavior,
    type ForestPhase,
  } from "$lib/scenes/forest/behaviors";
  import { FOX_POSE_ART } from "$lib/scenes/forest/artwork";
  import {
    FADE_S,
    MOTION_PROFILES,
    bankAngle,
    createMotion,
    creatureLayer,
    fadeVisibility,
    fleeDirection,
    listenDelay,
    listenFacing,
    stepFlee,
    stepMotion,
    stepSettle,
    type DepartureStyle,
    type Footprint,
  } from "$lib/scenes/motion";
  import { cancelFrame, requestFrame } from "$lib/frames";

  let {
    creature,
    sceneId,
    art,
    listeningArt,
    depthFade,
    departure,
    whilePaused,
    isNewest,
    frozen,
    listening,
    fleeing,
    ongone,
  }: {
    creature: CreatureInstance;
    sceneId: string;
    art: string;
    /** The same Creature facing out of the screen, if it has been drawn. */
    listeningArt: string | undefined;
    depthFade: boolean;
    /** How it leaves once scared off: see `fleeing`. */
    departure: DepartureStyle;
    /** Paused: turn to listen, or just hold still (see `SceneDef`). */
    whilePaused: "listen" | "hold";
    isNewest: boolean;
    /** Too Loud: hold perfectly still until the room settles. */
    frozen: boolean;
    /**
     * Paused, so the teacher is talking: come to a calm stop, then turn to
     * listen. Unlike `frozen`, which holds a scared animal mid-stride.
     */
    listening: boolean;
    /**
     * Scared off. Running away is a startled "!", then a bolt for the nearer
     * edge; fading is breaking up into static where it stands.
     */
    fleeing: boolean;
    /** Called once when a fleeing Creature is out of sight. */
    ongone: () => void;
  } = $props();

  const fading = $derived(fleeing && departure === "fade");

  /** Nearer Creatures are bigger; the roster width sets the species scale. */
  const width = $derived(
    (creature.def.width / 1920) * 100 * (0.7 + creature.depth * 0.7),
  );

  const profile = $derived(MOTION_PROFILES[creature.def.motion]);

  /**
   * Where a Rare Creature's sparkles twinkle, as % of its box. Spread round
   * the edges so they frame the animal rather than sit on its face, with
   * staggered delays so they never all flash at once.
   */
  const SPARKLES = [
    { x: 6, y: 10, size: 1, delay: 0 },
    { x: 86, y: 2, size: 0.75, delay: 0.9 },
    { x: 100, y: 60, size: 0.9, delay: 1.7 },
    { x: 60, y: 98, size: 0.65, delay: 0.45 },
    { x: 18, y: 86, size: 0.85, delay: 1.3 },
    { x: 44, y: -6, size: 0.6, delay: 2.1 },
    { x: 72, y: 40, size: 0.5, delay: 2.6 },
  ];

  /**
   * An Uncommon or Rare Creature glistens for its first minute in the Scene,
   * so the class notices it, then settles down to look like everyone else.
   * One brought back from before a refresh has had its minute already.
   */
  const GLISTEN_MS = 60_000;
  const SETTLE_MS = 2000;
  // Only the value it mounts with matters: the timer below takes it from there.
  // svelte-ignore state_referenced_locally
  let glistening = $state(!creature.restored);

  /**
   * Has turned to listen. Each Creature turns a moment after the pause, the
   * middle of the Scene first (`listenDelay`), so it ripples across the Scene.
   */
  let attending = $state(false);
  /** Purely decorative forest behavior, never a collected new Creature. */
  let forestMoment = $state<ForestBehavior | null>(null);
  let forestPhase = $state<ForestPhase | null>(null);
  /** The little perk-up as it turns, and the shake-off when talking ends. */
  let turning = $state(false);
  let shaking = $state(false);

  let swimmer: HTMLDivElement;
  let banker: HTMLDivElement;
  let flipper: HTMLDivElement;

  /**
   * Seconds a scared Creature stands startled, "!" up, before it bolts. A
   * little random on top, so several scared at once never leave in lockstep.
   */
  const STARTLE_S = 0.8;
  const STARTLE_JITTER_S = 0.5;

  onMount(() => {
    const scene = swimmer.parentElement!;
    const style = creature.def.motion;
    // The window the Scene is drawn in, which is not this one while it floats:
    // an observer belongs to the window that made it, and a hidden tab's
    // observers never report.
    const view = swimmer.ownerDocument.defaultView ?? window;
    const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");

    let sceneW = scene.clientWidth;
    let sceneH = scene.clientHeight;
    let selfW = swimmer.offsetWidth;
    let selfH = swimmer.offsetHeight;
    const footprint = (): Footprint => ({
      width: selfW / sceneW,
      height: selfH / sceneH,
      aspect: sceneH / sceneW,
    });

    const resize = new view.ResizeObserver(() => {
      sceneW = scene.clientWidth;
      sceneH = scene.clientHeight;
      selfW = swimmer.offsetWidth;
      selfH = swimmer.offsetHeight;
    });
    resize.observe(scene);
    resize.observe(swimmer);

    const settle = setTimeout(() => (glistening = false), GLISTEN_MS);

    const state =
      motions.get(creature) ??
      createMotion(
        style,
        creature.spawnX,
        creature.spawnY,
        creature.depth,
        footprint(),
        Math.random,
        creature.def.flips,
      );
    motions.set(creature, state);

    const forestKind = behaviorForCreature(sceneId, creature.def.slug);
    let forestState = forestKind
      ? (forestStates.get(creature) ??
        createForestBehavior(forestKind, Math.random))
      : null;
    // The same individual can return when a floating window is closed.
    // Reclaim the species slot in its new scene; a competing copy instead
    // receives a fresh independent countdown.
    if (
      forestState?.active &&
      forestKind &&
      !forestCoordinator.acquire(scene, forestKind, creature)
    ) {
      forestState = advanceForestBehavior(
        forestState,
        forestKind,
        0,
        false,
        Math.random,
      );
    }
    if (forestState) forestStates.set(creature, forestState);

    // Already Paused when drawn, as when the Scene floats out mid-announcement:
    // it was listening before, so it carries on without turning again.
    if (listening && !fleeing && whilePaused === "listen") {
      attending = true;
      state.facing = listenFacing(state);
    }

    /** Seconds until it turns to listen, once Paused. */
    let listenIn: number | null = null;
    let facing = 0;
    let fleeingTo: -1 | 1 | null = null;
    let startled = STARTLE_S + Math.random() * STARTLE_JITTER_S;
    let fadedFor = 0;
    let last = performance.now();
    let frame = requestFrame(function tick(now) {
      // Clamp, so a backgrounded tab does not teleport everyone on return.
      const elapsed = Math.min(0.1, (now - last) / 1000);
      let dt = elapsed;
      last = now;
      // Reduced motion keeps everyone moving, just very gently.
      if (reducedMotion.matches) dt *= 0.2;
      // Frozen stops time rather than skipping the frame, so the gait rock
      // holds its pose instead of snapping upright.
      // A Creature already running keeps running, even if the Scene freezes.
      if (frozen && !fleeing) dt = 0;

      if (forestState && forestKind) {
        const wasActive = forestState.active !== null;
        forestState = advanceForestBehavior(
          forestState,
          forestKind,
          elapsed,
          !frozen && !listening && !fleeing && !reducedMotion.matches,
          Math.random,
          forestCoordinator.available(scene, forestKind, creature),
        );
        if (!wasActive && forestState.active) {
          // Synchronously acquire: every other RAF callback now sees busy.
          if (!forestCoordinator.acquire(scene, forestKind, creature)) {
            forestState = advanceForestBehavior(
              forestState,
              forestKind,
              0,
              false,
              Math.random,
            );
          }
        } else if (wasActive && !forestState.active) {
          forestCoordinator.release(scene, forestKind, creature);
        }
        forestStates.set(creature, forestState);
        if (forestMoment !== forestState.active) {
          forestMoment = forestState.active;
        }
        if (forestPhase !== forestState.phase) {
          forestPhase = forestState.phase;
        }
      }

      if (fading) {
        // Stays where it was when the signal broke up. Fading is not
        // motion, so it runs on real time: neither the freeze nor reduced
        // motion holds it up.
        fadedFor += elapsed;
        banker.style.opacity = String(fadeVisibility(fadedFor));
        if (fadedFor >= FADE_S) {
          ongone();
          return;
        }
      } else if (fleeing && startled > 0) {
        startled -= dt;
      } else if (fleeing) {
        if (fleeingTo === null) {
          fleeingTo = fleeDirection(state);
          // Speed lines trail on the side it is running away from.
          swimmer.dataset.bolting = fleeingTo > 0 ? "right" : "left";
        }
        if (
          stepFlee(state, style, creature.depth, footprint(), fleeingTo, dt)
        ) {
          ongone();
          return;
        }
      } else if (listening) {
        stepSettle(state, style, creature.depth, footprint(), dt);
        if (!attending && whilePaused === "listen") {
          // Real time, like fading: reduced motion should not keep a Creature
          // looking away for five times as long.
          listenIn ??= listenDelay(state);
          listenIn -= elapsed;
          if (listenIn <= 0) {
            attending = true;
            turning = true;
            state.facing = listenFacing(state);
          }
        }
      } else if (forestMoment) {
        // Stops at the current spot without teleporting or changing depth.
        stepSettle(state, style, creature.depth, footprint(), dt);
      } else {
        listenIn = null;
        if (attending) {
          // Talking is over: a shake, a moment to gather itself, and off it
          // goes, not all at once.
          attending = false;
          shaking = true;
          state.resting = 0.4 + Math.random() * 1.4;
        }
        stepMotion(state, style, creature.depth, footprint(), dt, Math.random);
      }

      const left = state.x * sceneW - selfW / 2;
      const top = state.y * sceneH - selfH / 2;
      swimmer.style.transform = `translate3d(${left}px, ${top}px, 0)`;

      let angle = bankAngle(state, style);
      if (profile.ground) {
        // A walking gait: a little rock from side to side while moving. Crabs
        // skitter; the savanna animals (the ones with a `band`) only sway
        // slightly, so a plain full of walkers never reads as a stampede.
        const pace = Math.min(1, Math.abs(state.vx) / profile.speed);
        angle = fleeingTo
          ? Math.sin(state.age * 24) * 4
          : profile.band
            ? Math.sin(state.age * 6) * 1 * pace
            : Math.sin(state.age * 18) * 3 * pace;
      }
      banker.style.transform = `rotate(${angle}deg)`;

      if (state.facing !== facing) {
        facing = state.facing;
        flipper.style.transform = `scaleX(${facing})`;
      }

      frame = requestFrame(tick);
    });

    return () => {
      cancelFrame(frame);
      resize.disconnect();
      clearTimeout(settle);
      if (forestKind) {
        forestCoordinator.release(scene, forestKind, creature);
      }
    };
  });
</script>

<div
  bind:this={swimmer}
  class="swimmer pointer-events-none absolute top-0 left-0"
  class:fleeing
  class:fading
  data-forest-behavior={forestMoment}
  data-fox-phase={sceneId === "forest" && creature.def.slug === "red-fox"
    ? forestPhase
    : null}
  data-squirrel-phase={sceneId === "forest" &&
  creature.def.slug === "gray-squirrel"
    ? forestPhase
    : null}
  data-forest-species={sceneId === "forest" ? creature.def.slug : undefined}
  data-listening={attending}
  data-holding={listening && whilePaused === "hold" && !fleeing}
  style="
    width:calc({width} * var(--wu));
    z-index:{creatureLayer(profile, creature.depth)};
    opacity:{depthFade ? 0.62 + creature.depth * 0.38 : 1};
  "
>
  {#if fleeing && !fading}
    <!--
      Outside the flipper and the banker, so the "!" never mirrors or rocks,
      and big enough to read from the back of the room.
    -->
    <span class="flee-alert" aria-hidden="true">!</span>
    <span class="speed-lines" aria-hidden="true"><i></i><i></i><i></i></span>
  {/if}
  <div
    class={profile.ground ? "" : "bobber"}
    style="animation-duration:{5 + creature.depth * 4}s;"
  >
    <div bind:this={banker} class="relative">
      <!--
        The flip lives on its own element. `.arriving` animates `transform`
        with a forwards fill, and an animation's transform beats an inline one
        for as long as it is applied — which is until the *next* arrival,
        minutes later. Sharing an element would have left leftward swimmers
        going tail-first.
      -->
      <!-- Its own element too, for the same reason: the perk-up and the
           shake-off animate `transform`. -->
      <div
        class="poser"
        class:turning
        class:shaking
        onanimationend={(event) => {
          if (event.target !== event.currentTarget) return;
          turning = false;
          shaking = false;
        }}
      >
        <div bind:this={flipper} class="flipper">
          <div
            class="creature relative"
            class:arriving={isNewest}
            class:settled={!glistening}
            data-tier={creature.def.tier}
          >
            {#if isNewest}
              <!-- The payoff moment has to carry across a classroom. -->
              <span
                class="arrival-ring absolute inset-0 rounded-full border-2 border-white/70"
              ></span>
            {/if}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html attending && listeningArt ? listeningArt : art}
            {#if sceneId === "forest" && creature.def.slug === "red-fox"}
              <!-- A single articulated movement folds the original SVG into
                   this same-baseline sleeping artwork. No odd intermediate
                   still image, and the animation reverses when waking. -->
              <div
                class="forest-fox-pose forest-fox-pose-sleep"
                aria-hidden="true"
              >
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html FOX_POSE_ART.sleep}
              </div>
            {/if}
          </div>
        </div>
      </div>
      {#if creature.def.tier === "rare" && glistening}
        <span
          class="absolute inset-0"
          aria-hidden="true"
          out:fade={{ duration: SETTLE_MS }}
        >
          {#each SPARKLES as sparkle, i (i)}
            <svg
              class="sparkle"
              viewBox="-10 -10 20 20"
              aria-hidden="true"
              style="
                left:{sparkle.x}%;
                top:{sparkle.y}%;
                width:calc({sparkle.size * 2.2} * var(--wu));
                animation-delay:{sparkle.delay}s;
              "
            >
              <path
                d="M0 -10 C 1 -2, 2 -1, 10 0 C 2 1, 1 2, 0 10 C -1 2, -2 1, -10 0 C -2 -1, -1 -2, 0 -10 Z"
              />
            </svg>
          {/each}
        </span>
      {/if}
    </div>
  </div>
</div>
