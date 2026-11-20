import { describe, expect, test } from "bun:test";
import {
  advanceClownfishCuriosity,
  ClownfishCuriosityCoordinator,
  CLOWNFISH_PHASE_SECONDS,
  createClownfishCuriosity,
} from "./curiosity";

const zero = () => 0;
const half = () => 0.5;
const one = () => 1;
const advance = (
  state: ReturnType<typeof createClownfishCuriosity>,
  seconds: number,
  enabled = true,
  canStart = true,
) => advanceClownfishCuriosity(state, seconds, enabled, zero, canStart);

describe("quiet, individual clownfish moments", () => {
  test("different fish do not share a countdown", () => {
    expect(createClownfishCuriosity(zero).secondsUntilNext).toBe(18);
    expect(createClownfishCuriosity(half).secondsUntilNext).toBe(27);
    expect(createClownfishCuriosity(one).secondsUntilNext).toBe(36);
  });

  test("brakes, observes, and smoothly resumes normal swimming", () => {
    let state = createClownfishCuriosity(zero);
    state = advance(state, 17.9);
    expect(state.phase).toBeNull();
    state = advance(state, 0.1);
    expect(state.phase).toBe("brake");
    state = advance(state, CLOWNFISH_PHASE_SECONDS.brake);
    expect(state.phase).toBe("peek");
    state = advance(state, CLOWNFISH_PHASE_SECONDS.peek);
    expect(state.phase).toBe("resume");
    state = advance(state, CLOWNFISH_PHASE_SECONDS.resume);
    expect(state.phase).toBeNull();
    expect(state.secondsUntilNext).toBe(60);
  });

  test("a busy scene postpones just that fish, not all fish", () => {
    const waiting = advance(createClownfishCuriosity(zero), 18, true, false);
    expect(waiting.phase).toBeNull();
    expect(waiting.secondsUntilNext).toBe(7);
    expect(advance(waiting, 7).phase).toBe("brake");
  });

  test("teacher pause, noise, flight or reduced motion cancel the moment", () => {
    const looking = advance(
      advance(createClownfishCuriosity(zero), 18),
      CLOWNFISH_PHASE_SECONDS.brake,
    );
    expect(looking.phase).toBe("peek");
    const canceled = advance(looking, 0, false);
    expect(canceled.phase).toBeNull();
    expect(canceled.secondsUntilNext).toBe(25);
    expect(advance(canceled, 100, false)).toEqual(canceled);
    expect(advance(canceled, 24.9).phase).toBeNull();
  });

  test("only one fish per scene can hold a moment; different scenes are independent", () => {
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

  test("a school of clownfish never starts observing together", () => {
    const coordinator = new ClownfishCuriosityCoordinator<object, object>();
    const scene = {};
    const fish = Array.from({ length: 8 }, () => ({}));
    const states = fish.map(() => createClownfishCuriosity(zero));
    const next = states.map((state, i) => {
      const proposed = advanceClownfishCuriosity(
        state,
        18,
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
