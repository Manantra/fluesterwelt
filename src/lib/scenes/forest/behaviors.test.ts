import { expect, test } from "bun:test";
import {
  advanceForestBehavior,
  behaviorForCreature,
  createForestBehavior,
  FOX_PHASE_DURATION,
  SQUIRREL_PHASE_DURATION,
  type ForestBehaviorState,
  type FoxPhase,
  type SquirrelPhase,
} from "./behaviors";
import { ForestMomentCoordinator } from "./coordination";

const zero = () => 0;
const half = () => 0.5;
const one = () => 1;
const foxStep = (
  state: ForestBehaviorState,
  seconds: number,
  random = zero,
  canStart = true,
) => advanceForestBehavior(state, "fox", seconds, true, random, canStart);
const squirrelStep = (
  state: ForestBehaviorState,
  seconds: number,
  random = zero,
  canStart = true,
) => advanceForestBehavior(state, "squirrel", seconds, true, random, canStart);

test("only the two pilot species receive forest personalities", () => {
  expect(behaviorForCreature("forest", "red-fox")).toBe("fox");
  expect(behaviorForCreature("forest", "gray-squirrel")).toBe("squirrel");
  expect(behaviorForCreature("savanna", "red-fox")).toBeNull();
  expect(behaviorForCreature("forest", "hedgehog")).toBeNull();
});

test("duplicates have independent initial countdowns, not a common clock", () => {
  const first = createForestBehavior("fox", zero);
  const next = createForestBehavior("fox", half);
  const last = createForestBehavior("fox", one);
  expect([
    first.secondsUntilNext,
    next.secondsUntilNext,
    last.secondsUntilNext,
  ]).toEqual([16, 23, 30]);
  expect(createForestBehavior("squirrel", zero).secondsUntilNext).toBe(18);
});

test("the first fox gently lies down, sleeps, and rises without held slides", () => {
  expect(
    FOX_PHASE_DURATION.settle + FOX_PHASE_DURATION.down + FOX_PHASE_DURATION.up,
  ).toBeLessThan(3);
  let state = createForestBehavior("fox", zero);
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
  expect(state.completedMoments).toBe(1);
  expect(state.secondsUntilNext).toBe(60);
});

test("after its first nap a fox can sniff instead of always sleeping", () => {
  let state = foxStep(createForestBehavior("fox", zero), 16);
  state = foxStep(state, 0.45);
  state = foxStep(state, 1.2);
  state = foxStep(state, 8);
  state = foxStep(state, 1.05);
  expect(state.completedMoments).toBe(1);
  state = foxStep(state, 60, one);
  expect(state.active).toBe("fox-sniff");
  expect(state.phase).toBeNull();
  state = foxStep(state, 4.6, one);
  expect(state.active).toBeNull();
  expect(state.completedMoments).toBe(2);
});

test("the squirrel finds a nut, picks it up, nibbles, then finishes", () => {
  let state = createForestBehavior("squirrel", zero);
  state = squirrelStep(state, 18);
  expect(state.active).toBe("squirrel-acorn");
  expect(state.phase).toBe("search");

  const phases: { phase: SquirrelPhase; seconds: number }[] = [
    { phase: "pick", seconds: SQUIRREL_PHASE_DURATION.search },
    { phase: "nibble", seconds: SQUIRREL_PHASE_DURATION.pick },
    { phase: "finish", seconds: 3.5 },
  ];
  for (const next of phases) {
    state = squirrelStep(state, next.seconds);
    expect(state.active).toBe("squirrel-acorn");
    expect(state.phase).toBe(next.phase);
  }
  state = squirrelStep(state, SQUIRREL_PHASE_DURATION.finish);
  expect(state.active).toBeNull();
  expect(state.phase).toBeNull();
  expect(state.completedMoments).toBe(1);
  expect(state.secondsUntilNext).toBe(55);
});

test("a later squirrel moment can be its original lookout", () => {
  let state = squirrelStep(createForestBehavior("squirrel", zero), 18);
  state = squirrelStep(state, 1.65);
  state = squirrelStep(state, 0.9);
  state = squirrelStep(state, 3.5);
  state = squirrelStep(state, 0.85);
  state = squirrelStep(state, 55, one);
  expect(state.active).toBe("squirrel-lookout");
  expect(state.phase).toBeNull();
  expect(state.secondsRemaining).toBe(6);
});

test("busy species retries independently instead of copying the other fox", () => {
  let animal = createForestBehavior("fox", zero);
  animal = foxStep(animal, 16, zero, false);
  expect(animal.active).toBeNull();
  expect(animal.secondsUntilNext).toBe(7);
  animal = foxStep(animal, 7, zero, false);
  expect(animal.active).toBeNull();
  animal = foxStep(animal, 7, zero, true);
  expect(animal.active).toBe("fox-nap");
});

test("the coordinator allows only one foreground moment per species per scene", () => {
  const controller = new ForestMomentCoordinator<object, object>();
  const scene = {};
  const otherScene = {};
  const foxA = {};
  const foxB = {};
  const squirrel = {};

  expect(controller.acquire(scene, "fox", foxA)).toBe(true);
  expect(controller.available(scene, "fox", foxB)).toBe(false);
  expect(controller.acquire(scene, "fox", foxB)).toBe(false);
  expect(controller.acquire(scene, "squirrel", squirrel)).toBe(true);
  expect(controller.acquire(otherScene, "fox", foxB)).toBe(true);
  controller.release(scene, "fox", foxB); // nonowner cannot release
  expect(controller.available(scene, "fox", foxB)).toBe(false);
  controller.release(scene, "fox", foxA);
  expect(controller.acquire(scene, "fox", foxB)).toBe(true);
});

test("pause, too loud, flight and reduced motion cancel actions and stop the clock", () => {
  let state = foxStep(createForestBehavior("fox", zero), 16);
  state = foxStep(state, FOX_PHASE_DURATION.settle);
  expect(state.phase).toBe("down");
  state = advanceForestBehavior(state, "fox", 1, false, zero);
  expect(state.active).toBeNull();
  expect(state.phase).toBeNull();
  expect(state.secondsRemaining).toBe(0);
  expect(state.secondsUntilNext).toBe(60);
  expect(advanceForestBehavior(state, "fox", 600, false, zero)).toEqual(state);
  let squirrel = squirrelStep(createForestBehavior("squirrel", zero), 18);
  squirrel = advanceForestBehavior(squirrel, "squirrel", 1, false, zero);
  expect(squirrel.active).toBeNull();
});

test("no elapsed time is inert", () => {
  const state = createForestBehavior("fox", zero);
  expect(foxStep(state, 0)).toEqual(state);
  expect(foxStep(state, -3)).toEqual(state);
});

test("summoning many foxes at once cannot synchronize their extra moments", () => {
  const coordinator = new ForestMomentCoordinator<object, object>();
  const scene = {};
  const animals = Array.from({ length: 7 }, () => ({
    owner: {},
    state: createForestBehavior("fox", zero),
  }));
  for (const animal of animals) {
    animal.state = foxStep(
      animal.state,
      16,
      zero,
      coordinator.available(scene, "fox", animal.owner),
    );
    if (animal.state.active) {
      expect(coordinator.acquire(scene, "fox", animal.owner)).toBe(true);
    }
  }
  expect(animals.filter((animal) => animal.state.active).length).toBe(1);
  expect(
    animals.filter((animal) => animal.state.secondsUntilNext === 7).length,
  ).toBe(6);

  const first = animals[0];
  first.state = foxStep(first.state, 0.45);
  first.state = foxStep(first.state, 1.2);
  first.state = foxStep(first.state, 8);
  first.state = foxStep(first.state, 1.05);
  coordinator.release(scene, "fox", first.owner);
  expect(first.state.active).toBeNull();

  // A later fox now gets its own turn; others still keep wandering.
  const second = animals[1];
  second.state = foxStep(
    second.state,
    7,
    zero,
    coordinator.available(scene, "fox", second.owner),
  );
  expect(second.state.active).toBe("fox-nap");
  expect(coordinator.acquire(scene, "fox", second.owner)).toBe(true);
  expect(coordinator.available(scene, "fox", animals[2].owner)).toBe(false);
});

test("summoned squirrel duplicates don't all find nuts at the same instant", () => {
  const coordinator = new ForestMomentCoordinator<object, object>();
  const scene = {};
  const animals = Array.from({ length: 4 }, () => ({
    owner: {},
    state: createForestBehavior("squirrel", zero),
  }));
  for (const animal of animals) {
    animal.state = squirrelStep(
      animal.state,
      18,
      zero,
      coordinator.available(scene, "squirrel", animal.owner),
    );
    if (animal.state.active) {
      expect(coordinator.acquire(scene, "squirrel", animal.owner)).toBe(true);
    }
  }
  expect(
    animals.filter((animal) => animal.state.active === "squirrel-acorn"),
  ).toHaveLength(1);
  expect(animals.filter((animal) => animal.state.active === null)).toHaveLength(
    3,
  );
});
