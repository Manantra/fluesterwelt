import { expect, test } from "bun:test";
import {
  advanceForestBehavior,
  behaviorForCreature,
  createForestBehavior,
} from "./behaviors";

const zero = () => 0;
const half = () => 0.5;

test("only the two forest pilot animals receive extra behavior", () => {
  expect(behaviorForCreature("forest", "red-fox")).toBe("fox-nap");
  expect(behaviorForCreature("forest", "gray-squirrel")).toBe(
    "squirrel-lookout",
  );
  expect(behaviorForCreature("savanna", "red-fox")).toBeNull();
  expect(behaviorForCreature("forest", "black-bear")).toBeNull();
});

test("a fox pauses after its initial delay, then returns to normal wandering", () => {
  const initial = createForestBehavior("fox-nap", zero);
  expect(initial.secondsUntilNext).toBe(35);
  const waiting = advanceForestBehavior(initial, "fox-nap", 34, true, zero);
  expect(waiting.active).toBeNull();
  const napping = advanceForestBehavior(waiting, "fox-nap", 1, true, zero);
  expect(napping.active).toBe("fox-nap");
  expect(napping.secondsRemaining).toBe(9);
  const awake = advanceForestBehavior(napping, "fox-nap", 9, true, zero);
  expect(awake.active).toBeNull();
  expect(awake.secondsUntilNext).toBe(110);
});

test("squirrel takes shorter lookout pauses with randomized timing", () => {
  const initial = createForestBehavior("squirrel-lookout", half);
  expect(initial.secondsUntilNext).toBe(26.5);
  const lookout = advanceForestBehavior(
    initial,
    "squirrel-lookout",
    27,
    true,
    half,
  );
  expect(lookout.active).toBe("squirrel-lookout");
  expect(lookout.secondsRemaining).toBe(5.5);
  const done = advanceForestBehavior(
    lookout,
    "squirrel-lookout",
    5.5,
    true,
    half,
  );
  expect(done.secondsUntilNext).toBe(87.5);
});

test("teacher pause, noise and reduced motion interrupt a behavior", () => {
  const started = advanceForestBehavior(
    createForestBehavior("fox-nap", zero),
    "fox-nap",
    35,
    true,
    zero,
  );
  const stopped = advanceForestBehavior(started, "fox-nap", 1, false, zero);
  expect(stopped.active).toBeNull();
  expect(stopped.secondsRemaining).toBe(0);
  expect(advanceForestBehavior(stopped, "fox-nap", 600, false, zero)).toEqual(
    stopped,
  );
  expect(
    advanceForestBehavior(stopped, "fox-nap", 7, true, zero).active,
  ).toBeNull();
});

test("zero or negative elapsed time never starts another moment", () => {
  const initial = createForestBehavior("squirrel-lookout", zero);
  expect(
    advanceForestBehavior(initial, "squirrel-lookout", 0, true, zero),
  ).toEqual(initial);
  expect(
    advanceForestBehavior(initial, "squirrel-lookout", -3, true, zero),
  ).toEqual(initial);
});
