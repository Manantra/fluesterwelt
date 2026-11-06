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
  expect(
    squirrelArtwork.match(/class="forest-squirrel-held-acorn"/g),
  ).toHaveLength(1);
  expect(creatureComponent).not.toContain('class="forest-squirrel-acorn"');
  expect(forestStyles).toMatch(
    /\.swimmer\[data-squirrel-phase="nibble"\]\s+\.forest-squirrel-held-acorn/,
  );
  expect(forestStyles).not.toContain("forest-squirrel-acorn-seed");
  expect(forestStyles).not.toContain("forest-squirrel-last-bite");
  expect(forestStyles).toContain("forest-squirrel-lower-held-acorn");
  // The existing arm hinges near the shoulder: the nut now reaches the muzzle.
  expect(forestStyles).toContain("transform-box: view-box");
  expect(forestStyles).toContain("transform-origin: 68% 52%");
  expect(forestStyles).toContain("transform: rotate(-52deg)");
  // The animated nut/paws can nibble; the torso must not bounce like a dance.
  expect(forestStyles).not.toContain("forest-squirrel-nibble");
  expect(forestStyles).not.toMatch(
    /\.swimmer\[data-squirrel-phase="nibble"\]\s+\.poser/,
  );
});

test("the squirrel's muzzle hides the top of its raised original acorn", () => {
  const acorn = squirrelArtwork.indexOf(
    '<g class="forest-squirrel-held-acorn">',
  );
  const head = squirrelArtwork.indexOf(
    '<circle cx="68" cy="30" r="13"',
  );
  const muzzle = squirrelArtwork.indexOf('<path d="M84 39.1');
  const eyes = squirrelArtwork.indexOf('<circle cx="72" cy="28"');

  expect(acorn).toBeGreaterThan(0);
  // SVG paints later shapes in front. The existing face/muzzle therefore
  // covers the raised acorn's upper edge while it approaches the mouth.
  expect(head).toBeGreaterThan(acorn);
  expect(muzzle).toBeGreaterThan(acorn);
  expect(eyes).toBeGreaterThan(acorn);
  expect(forestStyles).toContain("transform: rotate(-52deg)");
  expect(creatureComponent).not.toContain('class="forest-squirrel-acorn"');
});

test("sunlight fades gradually instead of pulsing like a warning", () => {
  expect(forestStyles).toContain(
    "forest-sunlight-visit 160s ease-in-out infinite",
  );
  expect(forestStyles).toContain("width: calc(106 * var(--wu))");
  expect(forestStyles).toContain("opacity: 0.44");
});
