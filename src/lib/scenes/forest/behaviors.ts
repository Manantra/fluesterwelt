/**
 * Quiet, individual animal moments. Each arriving creature owns its own
 * countdown; the forest coordinator (outside this pure state machine) allows
 * only one extra moment of each species at a time.
 *
 * No new animals, rewards, sightings or audio recordings are created.
 */
export type ForestSpecies = "fox" | "squirrel";
export type ForestBehavior =
  "fox-nap" | "fox-sniff" | "squirrel-lookout" | "squirrel-acorn";
export type FoxPhase = "settle" | "down" | "sleep" | "up";
export type SquirrelPhase = "search" | "pick" | "nibble" | "finish";
export type ForestPhase = FoxPhase | SquirrelPhase;

export interface ForestBehaviorState {
  active: ForestBehavior | null;
  phase: ForestPhase | null;
  secondsUntilNext: number;
  secondsRemaining: number;
  /** Used to show each species' signature act once before varying it. */
  completedMoments: number;
}

interface SpeciesTiming {
  first: readonly [number, number];
  repeat: readonly [number, number];
  blockedRetry: readonly [number, number];
}

const TIMINGS: Record<ForestSpecies, SpeciesTiming> = {
  fox: { first: [16, 30], repeat: [60, 120], blockedRetry: [7, 15] },
  squirrel: { first: [18, 36], repeat: [55, 110], blockedRetry: [7, 15] },
};

export const FOX_PHASE_DURATION: Record<Exclude<FoxPhase, "sleep">, number> = {
  settle: 0.45,
  down: 1.2,
  up: 1.05,
};

export const SQUIRREL_PHASE_DURATION: Record<
  Exclude<SquirrelPhase, "nibble">,
  number
> = {
  search: 1.65,
  pick: 0.9,
  finish: 0.85,
};

const FOX_NEXT_PHASE: Record<FoxPhase, FoxPhase | null> = {
  settle: "down",
  down: "sleep",
  sleep: "up",
  up: null,
};

const SQUIRREL_NEXT_PHASE: Record<SquirrelPhase, SquirrelPhase | null> = {
  search: "pick",
  pick: "nibble",
  nibble: "finish",
  finish: null,
};

const FOX_SLEEP_DURATION: readonly [number, number] = [8, 12];
const FOX_SNIFF_DURATION: readonly [number, number] = [2.7, 4.6];
const SQUIRREL_NIBBLE_DURATION: readonly [number, number] = [3.5, 5.5];
const SQUIRREL_LOOKOUT_DURATION: readonly [number, number] = [3.5, 6];

export function behaviorForCreature(
  sceneId: string,
  slug: string,
): ForestSpecies | null {
  if (sceneId !== "forest") return null;
  if (slug === "red-fox") return "fox";
  if (slug === "gray-squirrel") return "squirrel";
  return null;
}

function between(range: readonly [number, number], random: () => number) {
  return range[0] + random() * (range[1] - range[0]);
}

export function createForestBehavior(
  species: ForestSpecies,
  random: () => number,
): ForestBehaviorState {
  return {
    active: null,
    phase: null,
    secondsUntilNext: between(TIMINGS[species].first, random),
    secondsRemaining: 0,
    completedMoments: 0,
  };
}

function startNext(
  state: ForestBehaviorState,
  species: ForestSpecies,
  random: () => number,
): ForestBehaviorState {
  // Different individuals don't always perform the same act. No sequence is
  // linked to a global clock, including the "summon all" testing shortcut.
  if (species === "fox") {
    if (state.completedMoments === 0 || random() < 0.65) {
      return {
        ...state,
        active: "fox-nap",
        phase: "settle",
        secondsUntilNext: 0,
        secondsRemaining: FOX_PHASE_DURATION.settle,
      };
    }
    return {
      ...state,
      active: "fox-sniff",
      phase: null,
      secondsUntilNext: 0,
      secondsRemaining: between(FOX_SNIFF_DURATION, random),
    };
  }

  if (state.completedMoments === 0 || random() < 0.7) {
    return {
      ...state,
      active: "squirrel-acorn",
      phase: "search",
      secondsUntilNext: 0,
      secondsRemaining: SQUIRREL_PHASE_DURATION.search,
    };
  }
  return {
    ...state,
    active: "squirrel-lookout",
    phase: null,
    secondsUntilNext: 0,
    secondsRemaining: between(SQUIRREL_LOOKOUT_DURATION, random),
  };
}

/**
 * Advance one individual. A busy species sets canStart=false: this animal
 * continues walking and retries a little later, rather than joining a chorus
 * of sleeping foxes. Teacher pause, noise, flight and reduced-motion cancel an
 * ongoing moment and stop every countdown while the scene is suspended.
 *
 * Each completed phase receives the next phase's exact duration. The scene's
 * frame loop clamps elapsed time to avoid jumps on tab restoration.
 */
export function advanceForestBehavior(
  state: ForestBehaviorState,
  species: ForestSpecies,
  seconds: number,
  enabled: boolean,
  random: () => number,
  canStart = true,
): ForestBehaviorState {
  if (!enabled) {
    return state.active
      ? {
          ...state,
          active: null,
          phase: null,
          secondsUntilNext: between(TIMINGS[species].repeat, random),
          secondsRemaining: 0,
        }
      : state;
  }
  if (seconds <= 0) return state;

  if (!state.active) {
    const until = state.secondsUntilNext - seconds;
    if (until > 0) return { ...state, secondsUntilNext: until };
    if (!canStart) {
      return {
        ...state,
        secondsUntilNext: between(TIMINGS[species].blockedRetry, random),
      };
    }
    return startNext(state, species, random);
  }

  const remaining = state.secondsRemaining - seconds;
  if (remaining > 0) return { ...state, secondsRemaining: remaining };

  if (state.active === "fox-nap" && state.phase) {
    const next = FOX_NEXT_PHASE[state.phase as FoxPhase];
    if (next) {
      return {
        ...state,
        phase: next,
        secondsRemaining:
          next === "sleep"
            ? between(FOX_SLEEP_DURATION, random)
            : FOX_PHASE_DURATION[next],
      };
    }
  }
  if (state.active === "squirrel-acorn" && state.phase) {
    const next = SQUIRREL_NEXT_PHASE[state.phase as SquirrelPhase];
    if (next) {
      return {
        ...state,
        phase: next,
        secondsRemaining:
          next === "nibble"
            ? between(SQUIRREL_NIBBLE_DURATION, random)
            : SQUIRREL_PHASE_DURATION[next],
      };
    }
  }

  return {
    active: null,
    phase: null,
    secondsUntilNext: between(TIMINGS[species].repeat, random),
    secondsRemaining: 0,
    completedMoments: state.completedMoments + 1,
  };
}
