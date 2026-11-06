/**
 * Small, optional moments of animal personality in the forest.
 *
 * The arrival/rarity system does not know about these moments: they do not
 * summon, remove, count, or unlock animals. The random input is injected so
 * the timing logic can be tested without rendering a Scene.
 */
export type ForestBehavior = "fox-nap" | "squirrel-lookout";

export interface ForestBehaviorState {
  /** Null means ordinary movement; a non-null value means a short quiet pause. */
  active: ForestBehavior | null;
  secondsUntilNext: number;
  secondsRemaining: number;
}

interface Timing {
  first: readonly [number, number];
  repeat: readonly [number, number];
  duration: readonly [number, number];
}

const TIMINGS: Record<ForestBehavior, Timing> = {
  // An occasional low crouch and a few seconds of sleep.
  "fox-nap": { first: [35, 60], repeat: [110, 170], duration: [9, 14] },
  // Pauses on the clearing, stands taller and looks around.
  "squirrel-lookout": { first: [18, 35], repeat: [65, 110], duration: [4, 7] },
};

export function behaviorForCreature(
  sceneId: string,
  slug: string,
): ForestBehavior | null {
  if (sceneId !== "forest") return null;
  if (slug === "red-fox") return "fox-nap";
  if (slug === "gray-squirrel") return "squirrel-lookout";
  return null;
}

function between(range: readonly [number, number], random: () => number) {
  return range[0] + random() * (range[1] - range[0]);
}

export function createForestBehavior(
  kind: ForestBehavior,
  random: () => number,
): ForestBehaviorState {
  return {
    active: null,
    secondsUntilNext: between(TIMINGS[kind].first, random),
    secondsRemaining: 0,
  };
}

/**
 * Advance a moment only while the scene is free to animate.
 * A microphone alarm, teacher pause, a fleeing animal or reduced-motion mode
 * cancels the moment immediately. Nothing accumulates while suspended.
 */
export function advanceForestBehavior(
  state: ForestBehaviorState,
  kind: ForestBehavior,
  seconds: number,
  enabled: boolean,
  random: () => number,
): ForestBehaviorState {
  if (!enabled) {
    return state.active
      ? {
          active: null,
          secondsUntilNext: Math.max(8, state.secondsUntilNext),
          secondsRemaining: 0,
        }
      : state;
  }
  if (seconds <= 0) return state;

  if (state.active) {
    const remaining = state.secondsRemaining - seconds;
    return remaining > 0
      ? { ...state, secondsRemaining: remaining }
      : {
          active: null,
          secondsUntilNext: between(TIMINGS[kind].repeat, random),
          secondsRemaining: 0,
        };
  }

  const until = state.secondsUntilNext - seconds;
  if (until > 0) return { ...state, secondsUntilNext: until };
  return {
    active: kind,
    secondsUntilNext: 0,
    secondsRemaining: between(TIMINGS[kind].duration, random),
  };
}
