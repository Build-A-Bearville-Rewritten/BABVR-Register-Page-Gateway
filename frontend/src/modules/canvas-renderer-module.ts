// Keeps track of all canvas renderer instances,
// and allows for getting and setting canvas renderers for each canvas

import CanvasRenderer from '../classes/rendering/canvas-renderer.ts';
import type {
  ICanvasRendererModule,
  GetCanvasRenderer
} from '../types/modules.ts';
import type { ICanvasRenderer } from '../types/rendering.ts';

/**
 * Singleton class for managing canvas renderer instances per canvas
 */
class CanvasRendererModuleClass implements ICanvasRendererModule {
  private _canvasRenderers: Map<HTMLCanvasElement, CanvasRenderer>;

  constructor() {
    this._canvasRenderers = new Map();
  }

  /**
   * Gets the canvas renderer for a given canvas, returning a new one if it doesn't already exist.
   * @param canvas - Canvas element to get the renderer for
   * @returns The canvas renderer instance
   */
  getCanvasRenderer: GetCanvasRenderer = (
    canvas: HTMLCanvasElement
  ): ICanvasRenderer => {
    // Get or create renderer for specific canvas
    if (!this._canvasRenderers.has(canvas)) {
      const newRenderer = new CanvasRenderer(canvas);
      this._canvasRenderers.set(canvas, newRenderer);
    }

    return this._canvasRenderers.get(canvas)!;
  };
}

// Export singleton instance
const CanvasRendererModule = new CanvasRendererModuleClass();
export default CanvasRendererModule;
