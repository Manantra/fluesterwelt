/**
 * An occasional exploratory loop for individual clownfish in the reef.
 * This never creates creatures, changes rewards, or affects the session clock.
 */
export type ClownfishPhase = "explore" | "rejoin";

export interface ClownfishCuriosityState {
  phase: ClownfishPhase | null;
  secondsUntilNext: number;
  secondsRemaining: number;
}

export const CLOWNFISH_PHASE_SECONDS = {
  explore: 8.2,
  rejoin: 0.9,
} as const;

const FIRST_WAIT: readonly [number, number] = [22, 40];
const REPEAT_WAIT: readonly [number, number] = [85, 145];
const BLOCKED_WAIT: readonly [number, number] = [7, 15];
const INTERRUPTED_WAIT: readonly [number, number] = [25, 45];

function between(range: readonly [number, number], random: () => number) {
  return range[0] + random() * (range[1] - range[0]);
}

export function createClownfishCuriosity(
  random: () => number,
): ClownfishCuriosityState {
  return {
    phase: null,
    secondsUntilNext: between(FIRST_WAIT, random),
    secondsRemaining: 0,
  };
}

/**
 * The real scene drives this with frame-clamped seconds. An interrupted moment
 * yields immediately to teacher pauses, Too Loud, flight or reduced motion.
 * A blocked fish follows its usual swim path and tries later instead of
 * starting an identical loop with the others.
 */
export function advanceClownfishCuriosity(
  state: ClownfishCuriosityState,
  seconds: number,
  enabled: boolean,
  random: () => number,
  canStart = true,
): ClownfishCuriosityState {
  if (!enabled) {
    return state.phase
      ? {
          phase: null,
          secondsUntilNext: between(INTERRUPTED_WAIT, random),
          secondsRemaining: 0,
        }
      : state;
  }

  if (state.phase === null) {
    if (state.secondsUntilNext - seconds > 1e-9) {
      return { ...state, secondsUntilNext: state.secondsUntilNext - seconds };
    }
    if (!canStart) {
      return {
        ...state,
        secondsUntilNext: between(BLOCKED_WAIT, random),
      };
    }
    return {
      phase: "explore",
      secondsUntilNext: 0,
      secondsRemaining: CLOWNFISH_PHASE_SECONDS.explore,
    };
  }

  if (state.secondsRemaining > seconds) {
    return { ...state, secondsRemaining: state.secondsRemaining - seconds };
  }

  switch (state.phase) {
    case "explore":
      return {
        ...state,
        phase: "rejoin",
        secondsRemaining: CLOWNFISH_PHASE_SECONDS.rejoin,
      };
    case "rejoin":
      return {
        phase: null,
        secondsUntilNext: between(REPEAT_WAIT, random),
        secondsRemaining: 0,
      };
  }
}

/** Exclusive only per actual DOM Scene, not across different classroom views. */
export class ClownfishCuriosityCoordinator<
  Scene extends object,
  Owner extends object,
> {
  private active = new WeakMap<Scene, Owner>();

  available(scene: Scene, owner: Owner): boolean {
    const current = this.active.get(scene);
    return current === undefined || current === owner;
  }

  acquire(scene: Scene, owner: Owner): boolean {
    if (!this.available(scene, owner)) return false;
    this.active.set(scene, owner);
    return true;
  }

  release(scene: Scene, owner: Owner): void {
    if (this.active.get(scene) === owner) this.active.delete(scene);
  }
}
