import type { ForestSpecies } from "./behaviors";

/**
 * One foreground animal moment per species per actual scene element.
 *
 * The DOM element is a WeakMap key so removed/scrolled-out scenes don't leak.
 * Ownership is tied to a CreatureInstance (not species), preventing duplicate
 * foxes from napping in sync after "Alle Tiere erscheinen lassen".
 * Unmounting for document picture-in-picture releases the owner; that same
 * individual can reacquire its retained timer on remount.
 */
export class ForestMomentCoordinator<
  Scene extends object,
  Owner extends object,
> {
  private readonly scenes = new WeakMap<Scene, Map<ForestSpecies, Owner>>();

  available(scene: Scene, species: ForestSpecies, owner: Owner): boolean {
    const current = this.scenes.get(scene)?.get(species);
    return current === undefined || current === owner;
  }

  acquire(scene: Scene, species: ForestSpecies, owner: Owner): boolean {
    if (!this.available(scene, species, owner)) return false;
    let moments = this.scenes.get(scene);
    if (!moments) {
      moments = new Map();
      this.scenes.set(scene, moments);
    }
    moments.set(species, owner);
    return true;
  }

  release(scene: Scene, species: ForestSpecies, owner: Owner): void {
    const moments = this.scenes.get(scene);
    if (moments?.get(species) === owner) {
      moments.delete(species);
      if (moments.size === 0) this.scenes.delete(scene);
    }
  }
}
