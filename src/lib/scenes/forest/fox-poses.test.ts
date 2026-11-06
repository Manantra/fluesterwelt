import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const artwork = readFileSync(
  new URL("./creatures/red-fox.svg", import.meta.url),
  "utf8",
);
const sleeping = readFileSync(
  new URL("./fox-poses/sleep.svg", import.meta.url),
  "utf8",
);

test("the walking fox artwork separates body parts for animation", () => {
  for (const part of [
    "fox-body",
    "fox-head",
    "fox-hindlegs",
    "fox-forelegs",
    "part-tail",
  ]) {
    expect(artwork).toContain('class="' + part);
  }
});

test("the sleeping fox stays on the original ground line", () => {
  const viewBox = 'viewBox="3.9 17 154.1 93"';
  expect(artwork).toContain(viewBox);
  expect(sleeping).toContain(viewBox);
  expect(sleeping).toContain('stroke-linecap="round"');
});
