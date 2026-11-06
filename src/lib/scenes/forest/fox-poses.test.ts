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

const squirrelArtwork = readFileSync(
  new URL("./creatures/gray-squirrel.svg", import.meta.url),
  "utf8",
);
const creatureComponent = readFileSync(
  new URL("../../components/Creature.svelte", import.meta.url),
  "utf8",
);
const forestStyles = readFileSync(
  new URL("./scene.css", import.meta.url),
  "utf8",
);

test("the squirrel nibbles its single original acorn instead of drawing another", () => {
  expect(squirrelArtwork.match(/class="forest-squirrel-held-acorn"/g)).toHaveLength(1);
  expect(creatureComponent).not.toContain('class="forest-squirrel-acorn"');
  expect(forestStyles).toContain(
    '.swimmer[data-squirrel-phase="nibble"] .forest-squirrel-held-acorn',
  );
  expect(forestStyles).not.toContain("forest-squirrel-acorn-seed");
  expect(forestStyles).not.toContain("forest-squirrel-last-bite");
  expect(forestStyles).toContain("forest-squirrel-lower-held-acorn");
});

test("sunlight fades gradually instead of pulsing like a warning", () => {
  expect(forestStyles).toContain("forest-sunlight-visit 160s ease-in-out infinite");
  expect(forestStyles).toContain("width: calc(106 * var(--wu))");
  expect(forestStyles).toContain("opacity: 0.44");
});
