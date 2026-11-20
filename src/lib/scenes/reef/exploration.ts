/**
 * A short elliptical scouting trip by a *moving* clownfish. Normal cruise
 * already includes waypoint rests and changes of direction; this instead
 * makes a recognizable, continuous small loop before the normal route resumes.
 *
 * All coordinates are fractions of the scene, as in scenes/motion.ts. The
 * route stays within the same open-water bounds as the ordinary swim logic.
 */
import {
  MOTION_PROFILES,
  type Footprint,
  type MotionState,
} from "$lib/scenes/motion";

export const CLOWNFISH_LOOP_SECONDS = 8.2;

export interface ClownfishExploration {
  readonly startX: number;
  readonly startY: number;
  readonly radiusX: number;
  readonly radiusY: number;
  readonly heading: -1 | 1;
  readonly vertical: -1 | 1;
  elapsed: number;
}

function waterBounds(footprint: Footprint) {
  const water = MOTION_PROFILES.cruise.region;
  return {
    xMin: Math.max(water.xMin, footprint.width / 2),
    xMax: Math.min(water.xMax, 1 - footprint.width / 2),
    yMin: Math.max(water.yMin, footprint.height / 2),
    yMax: Math.min(water.yMax, 1 - footprint.height / 2),
  };
}

/** Avoid launching a second "pause" from a fish already resting at a waypoint. */
export function createClownfishExploration(
  state: MotionState,
  footprint: Footprint,
  random: () => number = () => 0.5,
): ClownfishExploration | null {
  if (state.resting > 0 || Math.abs(state.vx) < 0.009) return null;

  const box = waterBounds(footprint);
  // The loop is symmetric horizontally: don't graze the glass at either side.
  const radiusX = Math.min(
    0.039 + random() * 0.014,
    state.x - box.xMin,
    box.xMax - state.x,
  );

  const spaceAbove = state.y - box.yMin;
  const spaceBelow = box.yMax - state.y;
  // With room on both sides, individuals can explore up *or* down.
  // Near an edge, the loop always bends back into the water.
  const vertical: -1 | 1 =
    spaceAbove > 0.12 && spaceBelow > 0.12
      ? random() < 0.5
        ? -1
        : 1
      : spaceAbove >= spaceBelow
        ? -1
        : 1;
  const availableY = (vertical < 0 ? spaceAbove : spaceBelow) / 2;
  const radiusY = Math.min(0.034 + random() * 0.013, availableY);
  if (radiusX < 0.024 || radiusY < 0.028) return null;

  return {
    startX: state.x,
    startY: state.y,
    radiusX,
    radiusY,
    heading: state.vx >= 0 ? 1 : -1,
    vertical,
    elapsed: 0,
  };
}

/**
 * Follow one smooth oval with a consistent tangential heading. The fish
 * starts exactly where it is, curves around, and returns to the same point
 * without a teleport, and ends facing its previous direction of travel.
 * Its velocities and age remain consistent for ordinary motion afterwards.
 */
export function stepClownfishExploration(
  state: MotionState,
  footprint: Footprint,
  path: ClownfishExploration,
  seconds: number,
): MotionState {
  if (seconds <= 0) return state;
  const beforeX = state.x;
  const beforeY = state.y;
  path.elapsed = Math.min(CLOWNFISH_LOOP_SECONDS, path.elapsed + seconds);
  const angle = (2 * Math.PI * path.elapsed) / CLOWNFISH_LOOP_SECONDS;

  state.x = path.startX + path.heading * path.radiusX * Math.sin(angle);
  state.y = path.startY + path.vertical * path.radiusY * (1 - Math.cos(angle));
  state.vx = (state.x - beforeX) / seconds;
  // MotionState vy uses scene-width units, so scale the scene-height delta.
  state.vy = ((state.y - beforeY) * footprint.aspect) / seconds;
  state.age += seconds;
  state.resting = 0;
  if (state.flips && Math.abs(state.vx) > MOTION_PROFILES.cruise.speed * 0.25) {
    state.facing = state.vx > 0 ? 1 : -1;
  }
  return state;
}
