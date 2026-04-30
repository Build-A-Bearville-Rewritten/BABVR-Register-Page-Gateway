// Keeps track of all sprite renderer instances,
// and allows for getting and setting sprite renderers for each canvas

import SpriteRenderer from '../classes/rendering/sprite-renderer.ts';
import type {
  ISpriteRendererModule,
  GetSpriteRenderer
} from '../types/modules.ts';
import type { ISpriteRenderer } from '../types/rendering.ts';

/**
 * Singleton class for managing sprite renderer instances per canvas
 */
class SpriteRendererModuleClass implements ISpriteRendererModule {
  private _spriteRenderers: Map<HTMLCanvasElement, SpriteRenderer>;
  private _defaultRenderer: SpriteRenderer | null = null;

  constructor() {
    this._spriteRenderers = new Map();
  }

  /**
   * Gets the sprite renderer for a given canvas, returning a new one if it doesn't already exist.
   * If no canvas is provided, returns a default renderer.
   * @param canvas - Optional canvas element to get the renderer for
   * @returns The sprite renderer instance
   */
  getSpriteRenderer: GetSpriteRenderer = (
    canvas?: HTMLCanvasElement
  ): ISpriteRenderer => {
    if (!canvas) {
      // Return default renderer if no canvas is provided
      if (!this._defaultRenderer) {
        this._defaultRenderer = new SpriteRenderer();
      }
      return this._defaultRenderer;
    }

    // Get or create renderer for specific canvas
    if (!this._spriteRenderers.has(canvas)) {
      const newRenderer = new SpriteRenderer();
      this._spriteRenderers.set(canvas, newRenderer);
    }

    return this._spriteRenderers.get(canvas)!;
  };
}

// Export singleton instance
const SpriteRendererModule = new SpriteRendererModuleClass();
export default SpriteRendererModule;
