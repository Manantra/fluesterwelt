import { expect, test } from "bun:test";
import {
  advanceForestBehavior,
  behaviorForCreature,
  createForestBehavior,
  FOX_PHASE_DURATION,
  type ForestBehaviorState,
  type FoxPhase,
} from "./behaviors";

const zero = () => 0;
const half = () => 0.5;
const foxStep = (state: ForestBehaviorState, seconds: number) =>
  advanceForestBehavior(state, "fox-nap", seconds, true, zero);

test("the fox and squirrel alone get the new forest behaviors", () => {
  expect(behaviorForCreature("forest", "red-fox")).toBe("fox-nap");
  expect(behaviorForCreature("forest", "gray-squirrel")).toBe(
    "squirrel-lookout",
  );
  expect(behaviorForCreature("savanna", "red-fox")).toBeNull();
  expect(behaviorForCreature("forest", "hedgehog")).toBeNull();
});

test("the fox has one short continuous move down and one move up", () => {
  // Intermediary positions are animated continuously by CSS, not held for seconds.
  expect(
    FOX_PHASE_DURATION.settle + FOX_PHASE_DURATION.down + FOX_PHASE_DURATION.up,
  ).toBeLessThan(3);
  expect(FOX_PHASE_DURATION.down).toBe(1.2);
  expect(FOX_PHASE_DURATION.up).toBe(1.05);

  let state = createForestBehavior("fox-nap", zero);
  expect(state.secondsUntilNext).toBe(16);
  state = foxStep(state, 15);
  expect(state.active).toBeNull();

  state = foxStep(state, 1);
  expect(state.active).toBe("fox-nap");
  expect(state.phase).toBe("settle");

  const phases: { phase: FoxPhase; seconds: number }[] = [
    { phase: "down", seconds: FOX_PHASE_DURATION.settle },
    { phase: "sleep", seconds: FOX_PHASE_DURATION.down },
    { phase: "up", seconds: 8 },
  ];

  for (const next of phases) {
    state = foxStep(state, next.seconds);
    expect(state.phase).toBe(next.phase);
    expect(state.active).toBe("fox-nap");
  }
  state = foxStep(state, FOX_PHASE_DURATION.up);
  expect(state.active).toBeNull();
  expect(state.phase).toBeNull();
  expect(state.secondsUntilNext).toBe(85);
});

test("squirrel retains the original short lookout moment", () => {
  let state = createForestBehavior("squirrel-lookout", half);
  expect(state.secondsUntilNext).toBe(26.5);
  state = advanceForestBehavior(state, "squirrel-lookout", 27, true, half);
  expect(state.active).toBe("squirrel-lookout");
  expect(state.phase).toBeNull();
  expect(state.secondsRemaining).toBe(5.5);
  state = advanceForestBehavior(state, "squirrel-lookout", 5.5, true, half);
  expect(state.active).toBeNull();
  expect(state.secondsUntilNext).toBe(87.5);
});

test("teacher pause, too loud, flight and reduced motion cancel the fox sequence", () => {
  let state = foxStep(createForestBehavior("fox-nap", zero), 16);
  state = foxStep(state, FOX_PHASE_DURATION.settle);
  expect(state.phase).toBe("down");
  state = advanceForestBehavior(state, "fox-nap", 1, false, zero);
  expect(state.active).toBeNull();
  expect(state.phase).toBeNull();
  expect(state.secondsRemaining).toBe(0);
  expect(state.secondsUntilNext).toBe(85);
  expect(advanceForestBehavior(state, "fox-nap", 600, false, zero)).toEqual(
    state,
  );
});

test("zero and negative elapsed time are inert", () => {
  const state = createForestBehavior("fox-nap", zero);
  expect(foxStep(state, 0)).toEqual(state);
  expect(foxStep(state, -3)).toEqual(state);
});
