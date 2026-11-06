/**
 * Quiet, decorative animal behavior: no new arrivals, points or unlocks.
 *
 * The fox lowers itself in a single articulated animation, rests in a
 * hand-drawn sleeping pose, then gets back up in one continuous movement.
 * Motion remains the caller's responsibility; this is a pure state machine.
 */
export type ForestBehavior = "fox-nap" | "squirrel-lookout";
export type FoxPhase = "settle" | "down" | "sleep" | "up";

export interface ForestBehaviorState {
  active: ForestBehavior | null;
  /** Non-null only while the fox is performing its short sequence. */
  phase: FoxPhase | null;
  secondsUntilNext: number;
  secondsRemaining: number;
}

interface Timing {
  first: readonly [number, number];
  repeat: readonly [number, number];
  duration: readonly [number, number];
}

const TIMINGS: Record<ForestBehavior, Timing> = {
  // First appearance is early enough to discover in a classroom demo.
  "fox-nap": { first: [16, 26], repeat: [85, 130], duration: [8, 12] },
  "squirrel-lookout": { first: [18, 35], repeat: [65, 110], duration: [4, 7] },
};

export const FOX_PHASE_DURATION: Record<Exclude<FoxPhase, "sleep">, number> = {
  // A short deceleration before the body folds down continuously.
  settle: 0.45,
  down: 1.2,
  up: 1.05,
};

const FOX_NEXT_PHASE: Record<FoxPhase, FoxPhase | null> = {
  settle: "down",
  down: "sleep",
  sleep: "up",
  up: null,
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
    phase: null,
    secondsUntilNext: between(TIMINGS[kind].first, random),
    secondsRemaining: 0,
  };
}

function startNext(
  state: ForestBehaviorState,
  kind: ForestBehavior,
  random: () => number,
): ForestBehaviorState {
  if (kind === "fox-nap") {
    return {
      ...state,
      active: kind,
      phase: "settle",
      secondsUntilNext: 0,
      secondsRemaining: FOX_PHASE_DURATION.settle,
    };
  }
  return {
    ...state,
    active: kind,
    phase: null,
    secondsUntilNext: 0,
    secondsRemaining: between(TIMINGS[kind].duration, random),
  };
}

/**
 * When teacher pause, noise, flight, or reduced-motion intervenes, the active
 * moment ends at once. The next one is scheduled normally, never immediately.
 * Countdown waits while the scene cannot animate.
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
          phase: null,
          secondsUntilNext: between(TIMINGS[kind].repeat, random),
          secondsRemaining: 0,
        }
      : state;
  }
  if (seconds <= 0) return state;

  if (state.active === null) {
    const until = state.secondsUntilNext - seconds;
    return until > 0
      ? { ...state, secondsUntilNext: until }
      : startNext(state, kind, random);
  }

  const remaining = state.secondsRemaining - seconds;
  if (remaining > 0) return { ...state, secondsRemaining: remaining };

  if (kind === "fox-nap" && state.phase) {
    const next = FOX_NEXT_PHASE[state.phase];
    if (next) {
      return {
        ...state,
        phase: next,
        secondsRemaining:
          next === "sleep"
            ? between(TIMINGS[kind].duration, random)
            : FOX_PHASE_DURATION[next],
      };
    }
  }

  return {
    active: null,
    phase: null,
    secondsUntilNext: between(TIMINGS[kind].repeat, random),
    secondsRemaining: 0,
  };
}
