import { describe, expect, test } from "bun:test";
import { createMotion } from "$lib/scenes/motion";
import {
  advanceClownfishCuriosity,
  ClownfishCuriosityCoordinator,
  CLOWNFISH_PHASE_SECONDS,
  createClownfishCuriosity,
} from "./curiosity";
import {
  CLOWNFISH_LOOP_SECONDS,
  createClownfishExploration,
  stepClownfishExploration,
} from "./exploration";

const zero = () => 0;
const half = () => 0.5;
const one = () => 1;
const footprint = { width: 0.036, height: 0.065, aspect: 9 / 16 };
const advance = (
  state: ReturnType<typeof createClownfishCuriosity>,
  seconds: number,
  enabled = true,
  canStart = true,
) => advanceClownfishCuriosity(state, seconds, enabled, zero, canStart);

describe("quiet, individually timed clownfish scouting trips", () => {
  test("different fish do not share a countdown", () => {
    expect(createClownfishCuriosity(zero).secondsUntilNext).toBe(22);
    expect(createClownfishCuriosity(half).secondsUntilNext).toBe(31);
    expect(createClownfishCuriosity(one).secondsUntilNext).toBe(40);
  });

  test("explores once then immediately rejoins the original swim", () => {
    let state = createClownfishCuriosity(zero);
    state = advance(state, 21.9);
    expect(state.phase).toBeNull();
    state = advance(state, 0.1);
    expect(state.phase).toBe("explore");
    state = advance(state, CLOWNFISH_PHASE_SECONDS.explore);
    expect(state.phase).toBe("rejoin");
    state = advance(state, CLOWNFISH_PHASE_SECONDS.rejoin);
    expect(state.phase).toBeNull();
    expect(state.secondsUntilNext).toBe(85);
  });

  test("a blocked fish keeps swimming instead of circling with the others", () => {
    const waiting = advance(createClownfishCuriosity(zero), 22, true, false);
    expect(waiting.phase).toBeNull();
    expect(waiting.secondsUntilNext).toBe(7);
    expect(advance(waiting, 7).phase).toBe("explore");
  });

  test("teacher pause, noise, flight or reduced motion cancel a special loop", () => {
    const exploring = advance(createClownfishCuriosity(zero), 22);
    expect(exploring.phase).toBe("explore");
    const canceled = advance(exploring, 0, false);
    expect(canceled.phase).toBeNull();
    expect(canceled.secondsUntilNext).toBe(25);
    expect(advance(canceled, 100, false)).toEqual(canceled);
    expect(advance(canceled, 24.9).phase).toBeNull();
  });

  test("only one fish per scene can circle; different scenes are independent", () => {
    const coordinator = new ClownfishCuriosityCoordinator<
      object,
      { id: number }
    >();
    const firstScene = {};
    const anotherScene = {};
    const first = { id: 1 };
    const second = { id: 2 };
    expect(coordinator.acquire(firstScene, first)).toBe(true);
    expect(coordinator.acquire(firstScene, second)).toBe(false);
    expect(coordinator.acquire(anotherScene, second)).toBe(true);
    coordinator.release(firstScene, second);
    expect(coordinator.available(firstScene, second)).toBe(false);
    coordinator.release(firstScene, first);
    expect(coordinator.acquire(firstScene, second)).toBe(true);
  });

  test("a school of clownfish never starts circling together", () => {
    const coordinator = new ClownfishCuriosityCoordinator<object, object>();
    const scene = {};
    const fish = Array.from({ length: 8 }, () => ({}));
    const states = fish.map(() => createClownfishCuriosity(zero));
    const next = states.map((state, i) => {
      const proposed = advanceClownfishCuriosity(
        state,
        22,
        true,
        zero,
        coordinator.available(scene, fish[i]),
      );
      if (proposed.phase) {
        expect(coordinator.acquire(scene, fish[i])).toBe(true);
      }
      return proposed;
    });
    expect(next.filter((state) => state.phase !== null)).toHaveLength(1);
  });
});

describe("clownfish exploratory oval", () => {
  function movingFish(x = 0.5, y = 0.5, heading: -1 | 1 = 1) {
    const state = createMotion("cruise", x, y, 0.5, footprint, zero);
    state.x = x;
    state.y = y;
    state.vx = heading * 0.032;
    state.resting = 0;
    state.facing = heading;
    return state;
  }

  test("does not replace ordinary waypoint pauses with another pause", () => {
    const resting = movingFish();
    resting.resting = 1.4;
    expect(createClownfishExploration(resting, footprint)).toBeNull();
    resting.resting = 0;
    resting.vx = 0;
    expect(createClownfishExploration(resting, footprint)).toBeNull();
  });

  test("makes a real smooth loop, reverses gently and ends at its start", () => {
    const state = movingFish();
    const origin = { x: state.x, y: state.y };
    const originalTarget = { x: state.targetX, y: state.targetY };
    const path = createClownfishExploration(state, footprint);
    expect(path).not.toBeNull();
    if (!path) return;

    const xs = [state.x];
    const ys = [state.y];
    const faces = [state.facing];
    for (let i = 0; i < 82; i++) {
      const oldX = state.x;
      const oldY = state.y;
      stepClownfishExploration(state, footprint, path, 0.1);
      xs.push(state.x);
      ys.push(state.y);
      faces.push(state.facing);
      const physicalStep = Math.hypot(
        state.x - oldX,
        (state.y - oldY) * footprint.aspect,
      );
      expect(physicalStep).toBeLessThan(0.006);
      expect(state.x).toBeGreaterThanOrEqual(0.06);
      expect(state.x).toBeLessThanOrEqual(0.94);
      expect(state.y).toBeGreaterThanOrEqual(0.1);
      expect(state.y).toBeLessThanOrEqual(0.78);
    }

    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(0.09);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(0.07);
    expect(faces).toContain(-1);
    expect(state.facing).toBe(1);
    expect(state.x).toBeCloseTo(origin.x, 6);
    expect(state.y).toBeCloseTo(origin.y, 6);
    expect(path.elapsed).toBeCloseTo(CLOWNFISH_LOOP_SECONDS, 6);
    expect(state.targetX).toBe(originalTarget.x);
    expect(state.targetY).toBe(originalTarget.y);
  });

  test("works in either direction while keeping the entire fish in bounds", () => {
    for (const heading of [-1, 1] as const) {
      for (const y of [0.12, 0.75]) {
        const state = movingFish(0.5, y, heading);
        const path = createClownfishExploration(state, footprint);
        expect(path).not.toBeNull();
        if (!path) continue;
        const start = { x: state.x, y: state.y };
        for (let i = 0; i < 82; i++) {
          stepClownfishExploration(state, footprint, path, 0.1);
          expect(state.y).toBeGreaterThanOrEqual(0.1);
          expect(state.y).toBeLessThanOrEqual(0.78);
          expect(state.x).toBeGreaterThanOrEqual(0.06);
          expect(state.x).toBeLessThanOrEqual(0.94);
        }
        expect(state.x).toBeCloseTo(start.x, 6);
        expect(state.y).toBeCloseTo(start.y, 6);
        expect(state.facing).toBe(heading);
      }
    }
  });

  test("fish have individual curve sizes and can scout in either vertical direction", () => {
    const fish = movingFish();
    const small = createClownfishExploration(fish, footprint, zero);
    const large = createClownfishExploration(fish, footprint, one);
    expect(small).not.toBeNull();
    expect(large).not.toBeNull();
    if (!small || !large) return;
    expect(small.radiusX).toBeLessThan(large.radiusX);
    expect(small.radiusY).toBeLessThan(large.radiusY);
    expect(small.vertical).toBe(-1);
    expect(large.vertical).toBe(1);
  });

  test("waits for enough room instead of clipping a loop against the glass", () => {
    expect(createClownfishExploration(movingFish(0.069), footprint)).toBeNull();
    expect(createClownfishExploration(movingFish(0.932), footprint)).toBeNull();
  });
});
